package com.example.payment.modules.payment.service;

import java.util.Map;

import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import com.example.payment.modules.merchant.entity.Merchant;
import com.example.payment.modules.merchant.repository.MerchantRepository;
import com.example.payment.modules.payment.dto.WebhookPayload;
import com.example.payment.modules.payment.entity.PaymentIntent;

@Service
public class MerchantWebhookService {

    private final MerchantRepository merchantRepository;
    private final WebhookEmitter webhookEmitter;

    public MerchantWebhookService(
            MerchantRepository merchantRepository,
            WebhookEmitter webhookEmitter) {
        this.merchantRepository = merchantRepository;
        this.webhookEmitter = webhookEmitter;
    }

    @Async
    public void emitPaymentIntentInitiated(Long merchantId, PaymentIntent intent) {
        Merchant merchant = merchantRepository.findById(merchantId)
                .orElse(null);

        if (merchant == null || merchant.getWebhookUrl() == null) {
            return;
        }

        WebhookPayload payload = new WebhookPayload(
                "payment_intent.initiated",
                Map.of(
                        "intentId", intent.getId(),
                        "amount", intent.getAmount(),
                        "currency", intent.getCurrency(),
                        "status", intent.getStatus().name(),
                        "clientSecret", intent.getClientSecret(),
                        "idempotencyKey", intent.getIdempotencyKey()),
                intent.getMetadata());
        String webhookSecret = "webhook-secret-key";
        webhookEmitter.emitWithRetry(
                merchant.getWebhookUrl(),
                payload,
                webhookSecret);
    }

    @Async
    public void emitPaymentIntentProcessing(Long merchantId, PaymentIntent intent) {
        Merchant merchant = merchantRepository.findById(merchantId)
                .orElse(null);

        if (merchant == null || merchant.getWebhookUrl() == null) {
            return;
        }

        WebhookPayload payload = new WebhookPayload(
                "payment_intent.processing",
                Map.of(
                        "intentId", intent.getId(),
                        "amount", intent.getAmount(),
                        "currency", intent.getCurrency(),
                        "status", intent.getStatus().name(),
                        "clientSecret", intent.getClientSecret(),
                        "idempotencyKey", intent.getIdempotencyKey()),
                intent.getMetadata());
        String webhookSecret = "webhook-secret-key";
        webhookEmitter.emitWithRetry(
                merchant.getWebhookUrl(),
                payload,
                webhookSecret);
    }

    @Async
    public void emitPaymentIntentSuccess(Long merchantId, PaymentIntent intent, String providerReference) {
        Merchant merchant = merchantRepository.findById(merchantId)
                .orElse(null);

        if (merchant == null || merchant.getWebhookUrl() == null) {
            return;
        }

        WebhookPayload payload = new WebhookPayload(
                "payment_intent.success",
                Map.of(
                        "intentId", intent.getId(),
                        "amount", intent.getAmount(),
                        "currency", intent.getCurrency(),
                        "status", intent.getStatus().name(),
                        "clientSecret", intent.getClientSecret(),
                        "providerReference", providerReference,
                        "idempotencyKey", intent.getIdempotencyKey()),
                intent.getMetadata());
        String webhookSecret = "webhook-secret-key";
        webhookEmitter.emitWithRetry(
                merchant.getWebhookUrl(),
                payload,
                webhookSecret);
    }

    @Async
    public void emitPaymentIntentFailed(Long merchantId, PaymentIntent intent) {
        Merchant merchant = merchantRepository.findById(merchantId)
                .orElse(null);

        if (merchant == null || merchant.getWebhookUrl() == null) {
            return;
        }

        WebhookPayload payload = new WebhookPayload(
                "payment_intent.failed",
                Map.of(
                        "intentId", intent.getId(),
                        "amount", intent.getAmount(),
                        "currency", intent.getCurrency(),
                        "status", intent.getStatus().name(),
                        "idempotencyKey", intent.getIdempotencyKey()),
                intent.getMetadata());
        String webhookSecret = "webhook-secret-key";
        webhookEmitter.emitWithRetry(
                merchant.getWebhookUrl(),
                payload,
                webhookSecret);
    }
}
