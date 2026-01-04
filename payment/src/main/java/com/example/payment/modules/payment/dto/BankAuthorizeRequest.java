package com.example.payment.modules.payment.dto;

public record BankAuthorizeRequest(
                String paymentMethodToken,
                long amount,
                String currency,
                Long orderId) {
}
