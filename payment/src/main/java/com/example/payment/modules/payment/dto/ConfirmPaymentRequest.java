package com.example.payment.modules.payment.dto;

import com.example.payment.core.enums.PaymentMethodType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ConfirmPaymentRequest {

    // ---------------- REQUIRED ----------------

    @NotBlank(message = "paymentMethodToken is required")
    private String paymentMethodToken;

    @NotNull(message = "paymentMethod is required")
    private PaymentMethodType paymentMethod;
    // CARD | UPI | NET_BANKING | WALLET

    // ---------------- OPTIONAL (METHOD-SPECIFIC) ----------------

    /**
     * Required when paymentMethod = CARD
     * Example: VISA, MASTERCARD, RUPAY
     */
    private String cardNetwork;

    /**
     * Required when paymentMethod = UPI
     * Example: gpay, phonepe, paytm
     */
    private String upiApp;

    /**
     * Required when paymentMethod = NET_BANKING
     * Example: hdfc, icici, sbi
     */
    private String bankCode;

    /**
     * Required when paymentMethod = WALLET
     * Example: PAYTM, AMAZON_PAY
     */
    private String walletProvider;

    // ---------------- REDIRECTION ----------------

    /**
     * Optional return URL for redirect-based flows
     * (UPI collect / Net banking / 3DS)
     */
    private String returnUrl;
}
