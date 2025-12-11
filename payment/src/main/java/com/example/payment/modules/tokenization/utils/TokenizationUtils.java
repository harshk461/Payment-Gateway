package com.example.payment.modules.tokenization.utils;

import org.springframework.stereotype.Component;

@Component
public class TokenizationUtils {
    public Boolean isValidCardNumber(String cardNumber) {
        return true;
    }

    public String detectBrand(String cardNumber) {
        return "Visa";
    }
}
