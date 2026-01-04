package com.example.payment.modules.payment.dto;

public record BankAuthorizeResponse(
        boolean approved,
        String bankReferenceCode,
        String reason) {
}
