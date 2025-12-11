package com.example.payment.modules.payment.utils;

import org.springframework.stereotype.Component;

import com.example.payment.common.AuditContext;
import com.example.payment.core.enums.PaymentIntentStatus;
import com.example.payment.exception.PaymentException;
import com.example.payment.modules.payment.entity.PaymentIntent;
import com.example.payment.modules.payment.repository.PaymentIntentRepository;

@Component
public class ConfirmPayment {
    private final PaymentIntentRepository paymentIntentRepository;

    public ConfirmPayment(PaymentIntentRepository paymentIntentRepository) {
        this.paymentIntentRepository = paymentIntentRepository;
    }

    public PaymentIntent validateAndGetIntent(Long intentId) {
        Long merchantId = AuditContext.getMerchantId();

        if (merchantId == null) {
            throw new PaymentException("Unauthorized: Merchant not resolved");
        }

        PaymentIntent payment = paymentIntentRepository.findById(intentId)
                .orElseThrow(() -> new PaymentException("Payment Intent not found"));

        if (!payment.getMerchantId().equals(merchantId)) {
            throw new PaymentException("You are not allowed to access this PaymentIntent");
        }

        if (payment.getStatus() == PaymentIntentStatus.SUCCEEDED ||
                payment.getStatus() == PaymentIntentStatus.FAILED) {

            throw new PaymentException(
                    "PaymentIntent already completed with status: " + payment.getStatus());
        }

        return payment;
    }
}
