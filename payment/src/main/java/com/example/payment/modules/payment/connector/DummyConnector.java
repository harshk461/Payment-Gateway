package com.example.payment.modules.payment.connector;

import java.util.Random;
import java.util.UUID;

import org.springframework.stereotype.Component;

import com.example.payment.core.enums.PaymentMethodType;
import com.example.payment.modules.payment.entity.PaymentIntent;
import com.example.payment.modules.payment.entity.PaymentTransaction;
import com.example.payment.modules.payment.service.MerchantWebhookService;

@Component
public class DummyConnector {

    private final Random random = new Random();

    public ConnectorResponse authorize(
            PaymentIntent intent,
            String paymentToken,
            PaymentMethodType paymentMethod,
            MerchantWebhookService merchantWebhookService,
            PaymentTransaction txn) {

        // Emit PROCESSING
        merchantWebhookService.emitPaymentIntentProcessing(
                intent.getMerchantId(), intent, txn);

        switch (paymentMethod) {

            case CARD:
                return handleCard(intent);

            case UPI:
                return handleUpi(intent);

            case WALLET:
                return handleWallet(intent);

            case NET_BANKING:
                return handleNetBanking(intent);

            default:
                throw new IllegalArgumentException("Unsupported payment method");
        }
    }

    // ---------------- CARD ----------------
    private ConnectorResponse handleCard(PaymentIntent intent) {
        simulateDelay(300);

        if (random.nextInt(100) < 92) {
            ConnectorResponse r = success("card");
            r.setCardNetwork(randomCardNetwork());
            return r;
        }

        return ConnectorResponse.failed(
                randomFrom("INSUFFICIENT_FUNDS", "CVV_MISMATCH", "CARD_EXPIRED"));
    }

    // ---------------- UPI ----------------
    private ConnectorResponse handleUpi(PaymentIntent intent) {
        simulateDelay(500);

        if (random.nextInt(100) < 80) {
            ConnectorResponse r = success("upi");
            r.setUpiApp(randomFrom("gpay", "phonepe", "paytm"));
            return r;
        }

        return ConnectorResponse.failed(
                randomFrom("USER_CANCELLED", "COLLECT_EXPIRED", "UPI_LIMIT_EXCEEDED"));
    }

    // ---------------- WALLET ----------------
    private ConnectorResponse handleWallet(PaymentIntent intent) {
        simulateDelay(200);

        if (random.nextInt(100) < 95) {
            ConnectorResponse r = success("wallet");
            r.setWalletProvider(randomFrom("PAYTM", "AMAZON_PAY", "PHONEPE"));
            return r;
        }

        return ConnectorResponse.failed("INSUFFICIENT_WALLET_BALANCE");
    }

    // ---------------- NET BANKING ----------------
    private ConnectorResponse handleNetBanking(PaymentIntent intent) {
        simulateDelay(800);

        if (random.nextInt(100) < 85) {
            ConnectorResponse r = success("nb");
            r.setBankCode(randomFrom("HDFC", "ICICI", "SBI", "AXIS"));
            return r;
        }

        return ConnectorResponse.failed(
                randomFrom("BANK_TIMEOUT", "AUTH_FAILED", "SESSION_EXPIRED"));
    }

    // ---------------- HELPERS ----------------
    private ConnectorResponse success(String prefix) {
        return new ConnectorResponse(
                true,
                prefix + "_txn_" + UUID.randomUUID()
                        .toString()
                        .replace("-", "")
                        .substring(0, 12));
    }

    private void simulateDelay(long millis) {
        try {
            Thread.sleep(millis);
        } catch (InterruptedException ignored) {
        }
    }

    private String randomFrom(String... values) {
        return values[random.nextInt(values.length)];
    }

    private String randomCardNetwork() {
        return randomFrom("VISA", "MASTERCARD", "RUPAY");
    }
}
