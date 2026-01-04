package com.example.payment.modules.payment.connector;

import org.springframework.stereotype.Component;

import com.example.payment.core.enums.PaymentMethodType;
import com.example.payment.modules.payment.dto.BankAuthorizeRequest;
import com.example.payment.modules.payment.dto.BankAuthorizeResponse;
import com.example.payment.modules.payment.dto.BankCaptureRequest;
import com.example.payment.modules.payment.dto.BankCaptureResponse;
import com.example.payment.modules.payment.entity.PaymentIntent;
import com.example.payment.modules.payment.entity.PaymentTransaction;
import com.example.payment.modules.payment.service.MerchantWebhookService;

@Component
public class BankConnector {

    private final BankClient bankClient;

    public BankConnector(BankClient bankClient) {
        this.bankClient = bankClient;
    }

    public ConnectorResponse authorize(
            PaymentIntent intent,
            String paymentToken,
            PaymentMethodType paymentMethod,
            MerchantWebhookService webhookService,
            PaymentTransaction txn) {

        // Emit PROCESSING
        webhookService.emitPaymentIntentProcessing(
                intent.getMerchantId(), intent, txn);

        if (paymentMethod != PaymentMethodType.CARD) {
            throw new IllegalArgumentException(
                    "Only CARD supported via BankConnector");
        }

        // 1️⃣ AUTHORIZE
        BankAuthorizeResponse authResponse = bankClient.authorize(new BankAuthorizeRequest(
                paymentToken,
                intent.getAmount(),
                intent.getCurrency(),
                intent.getId()));

        if (!authResponse.approved()) {
            return ConnectorResponse.failed(authResponse.reason());
        }

        // 2️⃣ CAPTURE (immediate capture model)
        BankCaptureResponse captureResponse = bankClient.capture(new BankCaptureRequest(
                authResponse.bankReferenceCode()));

        if (!captureResponse.captured()) {
            return ConnectorResponse.failed("CAPTURE_FAILED");
        }

        // 3️⃣ SUCCESS
        return new ConnectorResponse(
                true,
                captureResponse.paymentId());
    }
}
