package com.example.payment.modules.payment.connector;

import java.util.UUID;

import org.springframework.stereotype.Component;

import com.example.payment.modules.payment.entity.PaymentIntent;

@Component
public class DummyConnector {
    public ConnectorResponse authorize(PaymentIntent intent, String paymentToken) {
        // ----------------------------------------
        // In real PSP integration:
        // - validate token
        // - send HTTP request to PSP
        // - process PSP response
        // ----------------------------------------

        // For dummy connector → always success

        boolean success = true;

        // Generate PSP transaction reference like a real provider
        String providerRef = "dummy_txn_" + UUID.randomUUID().toString().replace("-", "").substring(0, 12);

        return new ConnectorResponse(success, providerRef);
    }
}
