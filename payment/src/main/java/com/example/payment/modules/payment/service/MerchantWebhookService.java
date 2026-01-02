package com.example.payment.modules.payment.service;

import java.util.HashMap;
import java.util.Map;

import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import com.example.payment.core.enums.PaymentMethodType;
import com.example.payment.modules.merchant.entity.Merchant;
import com.example.payment.modules.merchant.repository.MerchantRepository;
import com.example.payment.modules.payment.dto.WebhookPayload;
import com.example.payment.modules.payment.entity.PaymentIntent;
import com.example.payment.modules.payment.entity.PaymentTransaction;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class MerchantWebhookService {

        private final MerchantRepository merchantRepository;
        private final WebhookEmitter webhookEmitter;
        private final ObjectMapper objectMapper;

        // ---------------- INITIATED ----------------

        @Async
        public void emitPaymentIntentInitiated(
                        Long merchantId,
                        PaymentIntent intent,
                        String paymentMethod) {
                emit(
                                merchantId,
                                "payment_intent.initiated",
                                Map.of(
                                                "intentId", intent.getId(),
                                                "amount", intent.getAmount(),
                                                "currency", intent.getCurrency(),
                                                "status", intent.getStatus().name(),
                                                "paymentMethod", paymentMethod),
                                intent.getMetadata());
        }

        // ---------------- PROCESSING ----------------

        @Async
        public void emitPaymentIntentProcessing(
                        Long merchantId,
                        PaymentIntent intent,
                        PaymentTransaction txn) {
                emit(
                                merchantId,
                                "payment_intent.processing",
                                buildIntentTransactionData(intent, txn),
                                intent.getMetadata());
        }

        // ---------------- SUCCESS ----------------

        @Async
        public void emitPaymentIntentSuccess(
                        Long merchantId,
                        PaymentIntent intent,
                        PaymentTransaction txn) {
                emit(
                                merchantId,
                                "payment_intent.succeeded",
                                buildIntentTransactionData(intent, txn),
                                intent.getMetadata());
        }

        // ---------------- FAILED ----------------

        @Async
        public void emitPaymentIntentFailed(
                        Long merchantId,
                        PaymentIntent intent,
                        PaymentTransaction txn,
                        String failureReason) {
                Map<String, Object> data = buildIntentTransactionData(intent, txn);
                data.put("failureReason", failureReason);

                emit(
                                merchantId,
                                "payment_intent.failed",
                                data,
                                intent.getMetadata());
        }

        // ---------------- CORE EMITTER ----------------

        private void emit(
                        Long merchantId,
                        String eventType,
                        Map<String, Object> data,
                        String metadataJson) {
                Merchant merchant = merchantRepository.findById(merchantId).orElse(null);

                if (merchant == null || merchant.getWebhookUrl() == null) {
                        log.debug("Webhook skipped | merchantId={} event={}", merchantId, eventType);
                        return;
                }

                Map<String, Object> metadata = parseMetadata(metadataJson);

                WebhookPayload payload = new WebhookPayload(
                                eventType,
                                data,
                                metadata,
                                merchant.getWebhookVersion());

                try {
                        log.info("🚀 Sending webhook | merchantId={} event={}", merchantId, eventType);

                        webhookEmitter.emitWithRetry(
                                        merchant.getWebhookUrl(),
                                        payload,
                                        merchant.getWebhookSecret());

                } catch (Exception ex) {
                        log.error(
                                        "❌ Webhook emit failed | merchantId={} event={}",
                                        merchantId,
                                        eventType,
                                        ex);
                }
        }

        // ---------------- HELPERS ----------------

        private Map<String, Object> buildIntentTransactionData(
                        PaymentIntent intent,
                        PaymentTransaction txn) {
                Map<String, Object> data = new HashMap<>();

                data.put("intentId", intent.getId());
                data.put("amount", intent.getAmount());
                data.put("currency", intent.getCurrency());
                data.put("status", intent.getStatus().name());

                if (txn == null)
                        return data;

                data.put("paymentMethod", txn.getPaymentMethod().name());
                data.put("providerReference", txn.getProviderReference());

                if (txn.getPaymentMethod() == PaymentMethodType.CARD) {
                        data.put("cardNetwork", txn.getCardNetwork());
                }

                if (txn.getPaymentMethod() == PaymentMethodType.UPI) {
                        data.put("upiApp", txn.getUpiApp());
                }

                if (txn.getPaymentMethod() == PaymentMethodType.WALLET) {
                        data.put("walletProvider", txn.getWalletProvider());
                }

                if (txn.getPaymentMethod() == PaymentMethodType.NET_BANKING) {
                        data.put("bankCode", txn.getBankCode());
                }

                return data;
        }

        private Map<String, Object> parseMetadata(String metadataJson) {
                if (metadataJson == null || metadataJson.isBlank()) {
                        return Map.of();
                }

                try {
                        return objectMapper.readValue(
                                        metadataJson,
                                        new TypeReference<Map<String, Object>>() {
                                        });
                } catch (Exception ex) {
                        log.warn("Invalid metadata JSON in webhook", ex);
                        return Map.of();
                }
        }
}
