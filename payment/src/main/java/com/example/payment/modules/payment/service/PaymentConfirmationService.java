package com.example.payment.modules.payment.service;

import org.springframework.stereotype.Service;

import com.example.payment.core.enums.PaymentIntentStatus;
import com.example.payment.core.enums.TransactionStatus;
import com.example.payment.core.enums.WebhookStatus;
import com.example.payment.exception.PaymentException;
import com.example.payment.modules.payment.connector.ConnectorResponse;
import com.example.payment.modules.payment.connector.DummyConnector;
import com.example.payment.modules.payment.dto.ConfirmPaymentRequest;
import com.example.payment.modules.payment.dto.ConfirmPaymentResponse;
import com.example.payment.modules.payment.entity.PaymentIntent;
import com.example.payment.modules.payment.entity.PaymentTransaction;
import com.example.payment.modules.payment.entity.WebhookEvent;
import com.example.payment.modules.payment.repository.PaymentIntentRepository;
import com.example.payment.modules.payment.repository.PaymentTransactionRepository;
import com.example.payment.modules.payment.repository.WebhookEventRepository;
import com.example.payment.modules.payment.utils.ConfirmPayment;

@Service
public class PaymentConfirmationService {
    private final PaymentIntentRepository paymentIntentRepository;
    private final PaymentTransactionRepository paymentTransactionRepository;
    private final WebhookEventRepository webhookEventRepository;
    private final ConfirmPayment confirmPayment;
    private final DummyConnector dummyConnector;

    public PaymentConfirmationService(PaymentIntentRepository paymentIntentRepository,
            PaymentTransactionRepository paymentTransactionRepository, WebhookEventRepository webhookEventRepository,
            ConfirmPayment confirmPayment, DummyConnector dummyConnector) {
        this.paymentIntentRepository = paymentIntentRepository;
        this.paymentTransactionRepository = paymentTransactionRepository;
        this.webhookEventRepository = webhookEventRepository;
        this.confirmPayment = confirmPayment;
        this.dummyConnector = dummyConnector;
    }

    public ConfirmPaymentResponse confirmPaymentIntent(Long intentId, ConfirmPaymentRequest dto) {
        PaymentIntent intent = confirmPayment.validateAndGetIntent(intentId);

        if (dto.getPaymentMethodToken() == null || dto.getPaymentMethodToken().isBlank()) {
            throw new PaymentException("paymentMethodToken is required");
        }

        String paymentToken = dto.getPaymentMethodToken();

        intent.setStatus(PaymentIntentStatus.PROCESSING);
        paymentIntentRepository.save(intent);

        PaymentTransaction txn = new PaymentTransaction();
        txn.setIntentId(intent.getId());
        txn.setMerchantId(intent.getMerchantId());
        txn.setAmount(intent.getAmount());
        txn.setConnector("dummy");
        txn.setStatus(TransactionStatus.PENDING);
        txn.setAttemptNo(paymentTransactionRepository.countByIntentId(intent.getId()) + 1);
        txn.setResponsePayload("DUMMY RESPONSE");
        txn = paymentTransactionRepository.save(txn);

        ConnectorResponse connectorResponse = dummyConnector.authorize(intent, paymentToken);

        if (connectorResponse.isSuccess()) {
            // SUCCESS
            intent.setStatus(PaymentIntentStatus.SUCCEEDED);
            intent.setProviderReference(connectorResponse.getProviderReference());

            txn.setStatus(TransactionStatus.SUCCESS);
            txn.setProviderReference(connectorResponse.getProviderReference());
        } else {
            // FAILED
            intent.setStatus(PaymentIntentStatus.FAILED);
            txn.setStatus(TransactionStatus.FAILED);
        }

        paymentIntentRepository.save(intent);
        paymentTransactionRepository.save(txn);

        WebhookEvent event = new WebhookEvent();
        event.setMerchantId(intent.getMerchantId());
        event.setEventType(
                (connectorResponse.isSuccess()) ? "payment.succeeded" : "payment.failed");
        event.setPayload("{\"intentId\":" + intent.getId() + "}");
        event.setStatus(WebhookStatus.PENDING);
        event.setAttempts(0);
        event.setEndpoint("https://dummy-webhook.com/api/v2/payment/webhook");
        webhookEventRepository.save(event);

        // -------------------------------
        // 8. Build Response
        // -------------------------------
        return ConfirmPaymentResponse.builder()
                .intentId(intent.getId())
                .status(intent.getStatus().name())
                .amount(intent.getAmount())
                .currency(intent.getCurrency())
                .providerReference(intent.getProviderReference())
                .build();
    }
}
