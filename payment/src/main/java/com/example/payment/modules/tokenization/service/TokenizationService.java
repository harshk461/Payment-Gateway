package com.example.payment.modules.tokenization.service;

import java.util.UUID;

import org.springframework.stereotype.Service;

import com.example.payment.common.AuditContext;
import com.example.payment.core.enums.PaymentMethodType;
import com.example.payment.exception.PaymentException;
import com.example.payment.modules.payment.entity.PaymentMethod;
import com.example.payment.modules.payment.repository.PaymentMethodReposiory;
import com.example.payment.modules.tokenization.dto.CreateTokenRequest;
import com.example.payment.modules.tokenization.dto.CreateTokenResponse;
import com.example.payment.modules.tokenization.utils.TokenizationUtils;

@Service
public class TokenizationService {
    private final PaymentMethodReposiory paymentMethodReposiory;
    private final TokenizationUtils tokenizationUtils;

    public TokenizationService(PaymentMethodReposiory paymentMethodReposiory, TokenizationUtils tokenizationUtils) {
        this.paymentMethodReposiory = paymentMethodReposiory;
        this.tokenizationUtils = tokenizationUtils;
    }

    public CreateTokenResponse createPaymentMethodToken(CreateTokenRequest dto) {
        try {
            if (!"card".equals(dto.getType())) {
                throw new PaymentException("Only card tokenization supported right now");
            }

            String cardNumber = dto.getCard().getNumber();

            if (cardNumber == null || cardNumber.length() < 12) {
                throw new PaymentException("Invalid card number");
            }

            Boolean isValidCard = tokenizationUtils.isValidCardNumber(cardNumber);

            if (!isValidCard) {
                throw new PaymentException("Invalid Card Number Provided");
            }

            String brand = tokenizationUtils.detectBrand(cardNumber);

            String token = "pm_tok_" + UUID.randomUUID().toString().replace("-", "").substring(0, 16);

            String last4 = cardNumber.substring(cardNumber.length() - 4);

            PaymentMethod method = new PaymentMethod();
            method.setMerchantId(AuditContext.getMerchantId());
            method.setMethodType(PaymentMethodType.CARD);
            method.setBrand(brand);
            method.setLast4(last4);
            method.setToken(token);
            method.setExpMonth(dto.getCard().getExpMonth());
            method.setExpYear(dto.getCard().getExpYear());
            paymentMethodReposiory.save(method);

            return CreateTokenResponse.builder()
                    .brand(brand)
                    .last4(last4)
                    .token(token)
                    .build();
        } catch (Exception err) {
            throw new PaymentException(err.getMessage());
        }
    }
}
