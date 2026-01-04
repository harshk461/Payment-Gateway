package com.example.tokenization.service;

import java.time.Instant;
import java.time.YearMonth;
import java.time.ZoneOffset;
import java.time.temporal.ChronoUnit;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.tokenization.core.AesUtil;
import com.example.tokenization.core.TokenGenerator;
import com.example.tokenization.dto.ResolveTokenResponse;
import com.example.tokenization.dto.TokenizeCardRequest;
import com.example.tokenization.entity.CardVault;
import com.example.tokenization.repository.CardVaultRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TokenizationService {
    private final CardVaultRepository vaultRepository;
    @Autowired
    private final AesUtil aesUtil;
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

    public ResolveTokenResponse resolveToken(String paymentMethodToken) {

        if (paymentMethodToken == null || paymentMethodToken.isBlank()) {
            throw new IllegalArgumentException("Invalid payment token");
        }

        // 1️⃣ Fetch vault entry
        CardVault vault = vaultRepository
                .findByToken(paymentMethodToken)
                .orElseThrow(() -> new IllegalArgumentException("Token not found"));

        // 2️⃣ Validate token state
        if (!vault.getActive() || !"ACTIVE".equals(vault.getStatus())) {
            throw new IllegalArgumentException("Token is inactive");
        }

        // 3️⃣ Validate token expiry
        if (vault.getExpiresAt().isBefore(Instant.now())) {
            throw new IllegalArgumentException("Token has expired");
        }

        // 4️⃣ Decrypt PAN
        String cardNumber;
        try {
            cardNumber = aesUtil.decrypt(vault.getEncryptedPan());
        } catch (Exception e) {
            throw new IllegalStateException("PAN decryption failed");
        }

        // 5️⃣ Return ONLY required fields
        return ResolveTokenResponse.builder()
                .cardNumber(cardNumber)
                .expiryMonth(vault.getExpMonth())
                .expiryYear(vault.getExpYear())
                .cardNetwork(vault.getCardNetwork())
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
