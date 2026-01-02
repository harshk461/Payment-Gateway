package com.example.payment.modules.payment.service;

import org.springframework.stereotype.Service;

import com.example.payment.common.AuditContext;
import com.example.payment.common.TokenGenerator;
import com.example.payment.core.constant.ValidCurrency;
import com.example.payment.core.enums.PaymentIntentStatus;
import com.example.payment.exception.PaymentException;
import com.example.payment.modules.payment.dto.CreatePaymentIntentRequest;
import com.example.payment.modules.payment.dto.CreatePaymentIntentResponse;
import com.example.payment.modules.payment.dto.PaymentIntentResponse;
import com.example.payment.modules.payment.entity.PaymentIntent;
import com.example.payment.modules.payment.repository.PaymentIntentRepository;

@Service
public class PaymentIntentService {
    private final PaymentIntentRepository paymentIntentRepository;
    private final TokenGenerator tokenGenerator;
    private final MerchantWebhookService merchantWebhookService;

    public PaymentIntentService(PaymentIntentRepository paymentIntentRepository, TokenGenerator tokenGenerator,
            MerchantWebhookService merchantWebhookService) {
        this.paymentIntentRepository = paymentIntentRepository;
        this.tokenGenerator = tokenGenerator;
        this.merchantWebhookService = merchantWebhookService;
    }

    public CreatePaymentIntentResponse createPaymentIntent(CreatePaymentIntentRequest dto) {
        if (dto.getAmount() <= 0) {
            throw new PaymentException("Please Provide Valid Amount");
        }

        if (!ValidCurrency.SUPPORTED.contains(dto.getCurrency())) {
            throw new PaymentException("Currency is not SUPPORTED");
        }

        Long merchantId = AuditContext.getMerchantId();

        if (merchantId == null) {
            throw new PaymentException("Unauthorized: Invalid or missing API key");
        }

        if (dto.getIdempotencyKey() != null) {
            PaymentIntent existing = paymentIntentRepository
                    .findByMerchantIdAndIdempotencyKey(merchantId, dto.getIdempotencyKey());

            if (existing != null) {
                return convertToResponse(existing);
            }
        }

        PaymentIntent intent = new PaymentIntent();
        intent.setMerchantId(merchantId);
        intent.setAmount(dto.getAmount());
        intent.setCurrency(dto.getCurrency());
        intent.setStatus(PaymentIntentStatus.CREATED);
        intent.setClientSecret(tokenGenerator.generateClientSecret()); // random token
        intent.setDescription(dto.getDescription());
        intent.setMetadata(dto.getMetadata());
        intent.setIdempotencyKey(dto.getIdempotencyKey());

        intent = paymentIntentRepository.save(intent);

        merchantWebhookService.emitPaymentIntentInitiated(merchantId, intent, "");

        return CreatePaymentIntentResponse.builder()
                .intentId(intent.getId())
                .clientSecret(intent.getClientSecret())
                .currency(intent.getCurrency())
                .amount(intent.getAmount())
                .status(intent.getStatus().name())
                .build();

    }

    public PaymentIntentResponse getPaymentIntent(Long intentId) {

        Long merchantId = AuditContext.getMerchantId();
        if (merchantId == null) {
            throw new PaymentException("Unauthorized: Invalid or missing API key");
        }

        PaymentIntent payment = paymentIntentRepository.findById(intentId)
                .orElseThrow(() -> new PaymentException("Payment Intent doesn't exist"));

        // Ownership check (very important)
        if (!payment.getMerchantId().equals(merchantId)) {
            throw new PaymentException("You are not allowed to access this Payment Intent");
        }

        return PaymentIntentResponse.builder()
                .intentId(payment.getId())
                .amount(payment.getAmount())
                .currency(payment.getCurrency())
                .status(payment.getStatus().name()) // enum → String
                .paymentMethod(payment.getPaymentMethod()) // if exists
                .providerReference(payment.getProviderReference())
                .description(payment.getDescription())
                .metadata(payment.getMetadata())
                .createdAt(payment.getCreatedAt())
                .updatedAt(payment.getUpdatedAt())
                .build();
    }

    private CreatePaymentIntentResponse convertToResponse(PaymentIntent intent) {
        return CreatePaymentIntentResponse.builder()
                .intentId(intent.getId())
                .clientSecret(intent.getClientSecret())
                .amount(intent.getAmount())
                .currency(intent.getCurrency())
                .status(intent.getStatus().name())
                .build();
    }

}
