package com.example.payment.modules.payment.dto;

public record BankCaptureResponse(
        boolean captured,
        String paymentId) {
}
