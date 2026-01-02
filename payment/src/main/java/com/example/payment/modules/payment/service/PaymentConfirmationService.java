package com.example.payment.modules.payment.service;

import org.springframework.stereotype.Service;

import com.example.payment.core.enums.PaymentIntentStatus;
import com.example.payment.core.enums.TransactionStatus;
import com.example.payment.core.enums.WebhookStatus;
import com.example.payment.exception.PaymentException;
import com.example.payment.modules.merchant.entity.Merchant;
import com.example.payment.modules.merchant.repository.MerchantRepository;
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

import jakarta.transaction.Transactional;
import org.springframework.transaction.support.TransactionSynchronization;
import org.springframework.transaction.support.TransactionSynchronizationManager;

@Service
public class PaymentConfirmationService {
    private final PaymentIntentRepository paymentIntentRepository;
    private final MerchantRepository merchantRepository;
    private final PaymentTransactionRepository paymentTransactionRepository;
    private final WebhookEventRepository webhookEventRepository;
    private final ConfirmPayment confirmPayment;
    private final DummyConnector dummyConnector;
    private final MerchantWebhookService merchantWebhookService;

    public PaymentConfirmationService(PaymentIntentRepository paymentIntentRepository,
            PaymentTransactionRepository paymentTransactionRepository, WebhookEventRepository webhookEventRepository,
            ConfirmPayment confirmPayment, DummyConnector dummyConnector,
            MerchantWebhookService merchantWebhookService, MerchantRepository merchantRepository) {
        this.paymentIntentRepository = paymentIntentRepository;
        this.paymentTransactionRepository = paymentTransactionRepository;
        this.webhookEventRepository = webhookEventRepository;
        this.confirmPayment = confirmPayment;
        this.dummyConnector = dummyConnector;
        this.merchantWebhookService = merchantWebhookService;
        this.merchantRepository = merchantRepository;
    }

    @Transactional
    public ConfirmPaymentResponse confirmPaymentIntent(
            Long intentId,
            ConfirmPaymentRequest dto) {
        // 1️⃣ Load & validate intent
        PaymentIntent intent = confirmPayment.validateAndGetIntent(intentId);

        if (intent.getStatus() == PaymentIntentStatus.SUCCEEDED ||
                intent.getStatus() == PaymentIntentStatus.FAILED) {
            throw new PaymentException("Payment intent already finalized");
        }

        if (dto.getPaymentMethodToken() == null || dto.getPaymentMethodToken().isBlank()) {
            throw new PaymentException("paymentMethodToken is required");
        }

        // 2️⃣ Mark intent as PROCESSING
        intent.setStatus(PaymentIntentStatus.PROCESSING);
        paymentIntentRepository.save(intent);

        // 3️⃣ Create transaction
        PaymentTransaction txn = PaymentTransaction.builder()
                .intentId(intent.getId())
                .merchantId(intent.getMerchantId())
                .amount(intent.getAmount())
                .currency(intent.getCurrency())
                .connector("dummy")
                .status(TransactionStatus.PENDING)
                .attemptNo(
                        paymentTransactionRepository.countByIntentId(intent.getId()) + 1)

                // Payment method metadata
                .paymentMethod(dto.getPaymentMethod())
                .cardNetwork(dto.getCardNetwork())
                .upiApp(dto.getUpiApp())
                .walletProvider(dto.getWalletProvider())
                .bankCode(dto.getBankCode())

                // Result fields
                .providerReference(null)
                .failureReason(null)
                .responsePayload(null)
                .build();

        txn = paymentTransactionRepository.save(txn);

        // 4️⃣ Call connector
        ConnectorResponse connectorResponse = dummyConnector.authorize(
                intent,
                dto.getPaymentMethodToken(),
                dto.getPaymentMethod(),
                merchantWebhookService, txn);

        // 5️⃣ Apply result
        if (connectorResponse.isSuccess()) {

            intent.setStatus(PaymentIntentStatus.SUCCEEDED);
            intent.setProviderReference(connectorResponse.getProviderReference());

            txn.setStatus(TransactionStatus.SUCCESS);
            txn.setProviderReference(connectorResponse.getProviderReference());
            txn.setFailureReason(null);

        } else {

            intent.setStatus(PaymentIntentStatus.FAILED);

            txn.setStatus(TransactionStatus.FAILED);
            txn.setFailureReason(connectorResponse.getFailureReason());
        }

        // 6️⃣ Persist final state ONCE
        paymentIntentRepository.save(intent);
        paymentTransactionRepository.save(txn);

        // 7️⃣ Emit webhook AFTER COMMIT (CRITICAL)
        // Persist final state
        PaymentTransaction savedTxn = paymentTransactionRepository.save(txn);
        PaymentIntent savedIntent = paymentIntentRepository.save(intent);

        // Emit webhook AFTER COMMIT
        TransactionSynchronizationManager.registerSynchronization(
                new TransactionSynchronization() {
                    @Override
                    public void afterCommit() {

                        if (savedIntent.getStatus() == PaymentIntentStatus.SUCCEEDED) {

                            merchantWebhookService.emitPaymentIntentSuccess(
                                    savedIntent.getMerchantId(),
                                    savedIntent,
                                    savedTxn);

                        } else {

                            merchantWebhookService.emitPaymentIntentFailed(
                                    savedIntent.getMerchantId(),
                                    savedIntent,
                                    savedTxn,
                                    savedTxn.getFailureReason());
                        }
                    }
                });

        Merchant merchant = merchantRepository.findById(intent.getMerchantId())
                .orElseThrow(() -> new PaymentException("Merchant Doesn;t Exist"));
        // 8️⃣ (Optional) Persist webhook event for retry system
        WebhookEvent webhookEvent = new WebhookEvent();
        webhookEvent.setMerchantId(intent.getMerchantId());
        webhookEvent.setEventType(
                intent.getStatus() == PaymentIntentStatus.SUCCEEDED
                        ? "payment_intent.succeeded"
                        : "payment_intent.failed");
        webhookEvent.setPayload(
                "{\"intentId\":" + intent.getId() + "}");
        webhookEvent.setStatus(WebhookStatus.PENDING);
        webhookEvent.setAttempts(0);
        webhookEvent.setEndpoint(merchant.getWebhookUrl()); // if stored
        webhookEventRepository.save(webhookEvent);

        // 9️⃣ Response
        return ConfirmPaymentResponse.builder()
                .intentId(intent.getId())
                .status(intent.getStatus().name())
                .amount(intent.getAmount())
                .currency(intent.getCurrency())
                .providerReference(intent.getProviderReference())
                .build();
    }

}
