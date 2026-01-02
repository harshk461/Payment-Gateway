package com.example.tokenization.service;

import java.time.Instant;
import java.time.YearMonth;
import java.time.ZoneOffset;
import java.time.temporal.ChronoUnit;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.tokenization.core.AesUtil;
import com.example.tokenization.core.TokenGenerator;
import com.example.tokenization.dto.AuthorizeRequest;
import com.example.tokenization.dto.AuthorizeResponse;
import com.example.tokenization.dto.BankAuthorizeRequest;
import com.example.tokenization.dto.BankAuthorizeResponse;
import com.example.tokenization.dto.DetokenizedCardRequest;
import com.example.tokenization.dto.DetokenizedCardResponse;
import com.example.tokenization.dto.TokenizeCardRequest;
import com.example.tokenization.entity.AuditLog;
import com.example.tokenization.entity.AuthorizationRequest;
import com.example.tokenization.entity.CardVault;
import com.example.tokenization.exception.TokenizationException;
import com.example.tokenization.repository.AuditLogRepository;
import com.example.tokenization.repository.AuthorizationRequestRepository;
import com.example.tokenization.repository.CardVaultRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TokenizationService {
    private final CardVaultRepository vaultRepository;
    @Autowired
    private final BankClient bankClient;
    private final AesUtil aesUtil;
    private final AuditLogRepository auditLogRepository;
    private final AuthorizationRequestRepository authRepo;
    private final TokenGenerator tokenGenerator;

    public String tokenizeCard(TokenizeCardRequest dto) {

        // 1️⃣ Validate PAN
        validatePan(dto.getCardNumber());
        validateExpiry(dto.getExpMonth(), dto.getExpYear());

        // 2️⃣ Encrypt PAN only
        String encryptedPan = aesUtil.encrypt(dto.getCardNumber());

        String encryptedCvv = aesUtil.encrypt(dto.getCvv());

        // 3️⃣ Generate token (collision-safe)
        String token = tokenGenerator.generateToken();

        // 4️⃣ Create vault entry
        CardVault vault = CardVault.builder()
                .token(token)
                .encryptedPan(encryptedPan)
                .encryptedCvv(encryptedCvv)
                .panLast4(dto.getCardNumber()
                        .substring(dto.getCardNumber().length() - 4))
                .cardNetwork(detectBrand(dto.getCardNumber()))
                .expMonth(dto.getExpMonth())
                .expYear(dto.getExpYear())
                .cardHolderName(dto.getCardHolderName())
                .status("ACTIVE")
                .createdAt(Instant.now())
                .expiresAt(Instant.now().plus(7,
                        ChronoUnit.DAYS))
                .active(true)
                .build();

        vaultRepository.save(vault);

        // 5️⃣ DO NOT STORE CVV
        return token;
    }

    public DetokenizedCardResponse detokenizeToken(DetokenizedCardRequest dto) {

        // 1️⃣ Validate input
        if (dto == null || dto.getPaymentMethodToken() == null || dto.getPaymentMethodToken().isBlank()) {
            throw new TokenizationException("paymentMethodToken is required");
        }

        if (dto.getPurpose() == null || dto.getPurpose().isBlank()) {
            throw new TokenizationException("purpose is required");
        }

        // 2️⃣ Validate allowed purposes
        if (!dto.getPurpose().equals("AUTHORIZATION")) {
            throw new TokenizationException("Invalid detokenization purpose");
        }

        // 3️⃣ Fetch vault entry
        CardVault vault = vaultRepository.findByToken(dto.getPaymentMethodToken())
                .orElseThrow(() -> new TokenizationException(
                        "Invalid or unknown token"));

        // 4️⃣ Validate token state
        if (!vault.getActive()) {
            throw new TokenizationException("Token is inactive or revoked");
        }

        if (vault.getExpiresAt().isBefore(Instant.now())) {
            throw new TokenizationException("Token has expired");
        }

        // 5️⃣ Decrypt sensitive data
        String pan;
        String cvv;

        try {
            pan = aesUtil.decrypt(vault.getEncryptedPan());
            cvv = aesUtil.decrypt(vault.getEncryptedCvv());
        } catch (Exception ex) {
            throw new TokenizationException("Failed to decrypt card data");
        }

        // 6️⃣ Audit log (IMPORTANT)
        // auditLogRepository.logDetokenization(
        // vault.getToken(),
        // dto.getPurpose(),
        // "BANK_SERVER");

        // 7️⃣ Return minimal required data
        return DetokenizedCardResponse.builder()
                .cardNumber(pan)
                .cvv(cvv)
                .expMonth(vault.getExpMonth())
                .expYear(vault.getExpYear())
                .build();
    }

    public AuthorizeResponse authorize(AuthorizeRequest dto) {
        CardVault vault = vaultRepository.findByToken(dto.getPaymentMethodToken())
                .orElseThrow(() -> new TokenizationException("Invalid token"));

        if (!vault.getActive()) {
            throw new TokenizationException("Token revoked");
        }

        // 3️⃣ Detokenize (IN MEMORY)
        String pan = aesUtil.decrypt(vault.getEncryptedPan());
        String cvv = aesUtil.decrypt(vault.getEncryptedCvv());

        // 4️⃣ Call bank server
        BankAuthorizeRequest bankReq = BankAuthorizeRequest.builder()
                .pan(pan)
                .cvv(cvv)
                .expMonth(vault.getExpMonth())
                .expYear(vault.getExpYear())
                .amount(dto.getAmount())
                .currency(dto.getCurrency())
                .build();

        BankAuthorizeResponse bankRes = bankClient.authorize(bankReq);

        // 5️⃣ Persist authorization attempt
        String randomAuthorizationId = UUID.randomUUID().toString();

        AuthorizationRequest auth = AuthorizationRequest.builder()
                .authorizationId(randomAuthorizationId)
                .token(dto.getPaymentMethodToken())
                .merchantId(dto.getMerchantId())
                .amount(dto.getAmount())
                .currency(dto.getCurrency())
                .status(bankRes.isApproved() ? "AUTHORIZED" : "DECLINED")
                .bankRrn(bankRes.getBankReference())
                .build();

        authRepo.save(auth);

        // 6️⃣ Audit log (PCI requirement)
        auditLogRepository.save(
                AuditLog.builder()
                        .actor("SYSTEM")
                        .referenceId(bankRes.getBankReference())
                        .action("AUTHORIZE")
                        .token(dto.getPaymentMethodToken())
                        .purpose(dto.getPurpose())
                        .build());

        // 7️⃣ Return SAFE response
        return AuthorizeResponse.builder()
                .authorized(bankRes.isApproved())
                .bankReference(bankRes.getBankReference())
                .status(bankRes.isApproved() ? "AUTHORIZED" : "DECLINED")
                .reason(bankRes.getDeclineReason())
                .build();
    }

    private void validatePan(String pan) {
        if (pan == null || !pan.matches("\\d{13,19}")) {
            throw new IllegalArgumentException("Invalid PAN format");
        }
        if (!luhnCheck(pan)) {
            throw new IllegalArgumentException("Invalid card number");
        }
    }

    private String detectBrand(String card) {
        if (card.startsWith("4"))
            return "VISA";
        if (card.startsWith("5"))
            return "MASTERCARD";
        if (card.startsWith("6"))
            return "RUPAY";
        return "UNKNOWN";
    }

    private boolean luhnCheck(String pan) {
        int sum = 0;
        boolean alternate = false;

        for (int i = pan.length() - 1; i >= 0; i--) {
            int n = pan.charAt(i) - '0';

            if (alternate) {
                n *= 2;
                if (n > 9) {
                    n = (n % 10) + 1;
                }
            }

            sum += n;
            alternate = !alternate;
        }

        return (sum % 10 == 0);
    }

    private void validateExpiry(Integer expMonth, Integer expYear) {

        if (expMonth == null || expYear == null) {
            throw new IllegalArgumentException("Expiry month and year are required");
        }

        if (expMonth < 1 || expMonth > 12) {
            throw new IllegalArgumentException("Invalid expiry month");
        }

        // Normalize 2-digit year → 4-digit (e.g. 25 → 2025)
        if (expYear < 100) {
            expYear += 2000;
        }

        YearMonth expiry = YearMonth.of(expYear, expMonth);
        YearMonth current = YearMonth.now(ZoneOffset.UTC);

        if (expiry.isBefore(current)) {
            throw new IllegalArgumentException("Card has expired");
        }
    }

}
