package com.example.payment.modules.payment.controller;

import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.payment.modules.payment.dto.ConfirmPaymentRequest;
import com.example.payment.modules.payment.dto.ConfirmPaymentResponse;
import com.example.payment.modules.payment.service.PaymentConfirmationService;

@RestController
@RequestMapping("/api/v1/payment_intents")
public class PaymentConfirmController {
    private final PaymentConfirmationService paymentConfirmationService;

    PaymentConfirmController(PaymentConfirmationService paymentConfirmationService) {
        this.paymentConfirmationService = paymentConfirmationService;
    }

    @PostMapping("/{intentId}/confirm")
    public ConfirmPaymentResponse confirmPayment(
            @PathVariable Long intentId,
            @RequestBody ConfirmPaymentRequest request) {
        return paymentConfirmationService.confirmPaymentIntent(intentId, request);
    }
}
