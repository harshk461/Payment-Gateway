package com.example.payment.modules.payment.controller;

import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import com.example.payment.modules.payment.dto.CreatePaymentIntentRequest;
import com.example.payment.modules.payment.dto.CreatePaymentIntentResponse;
import com.example.payment.modules.payment.dto.PaymentIntentResponse;
import com.example.payment.modules.payment.service.PaymentIntentService;

@RestController
@RequestMapping("/api/v1/payment")
public class PaymentIntentController {

    private final PaymentIntentService paymentIntentService;

    public PaymentIntentController(PaymentIntentService paymentIntentService) {
        this.paymentIntentService = paymentIntentService;
    }

    @PostMapping("/create")
    public CreatePaymentIntentResponse createPaymentIntent(
            @Valid @RequestBody CreatePaymentIntentRequest dto) {

        return this.paymentIntentService.createPaymentIntent(dto);
    }

    @GetMapping("/{intentId}")
    public PaymentIntentResponse getPaymentIntent(@PathVariable Long intentId) {
        return this.paymentIntentService.getPaymentIntent(intentId);
    }
}
