package com.example.payment.modules.payment.dto;

import lombok.Data;

@Data
public class ConfirmPaymentRequest {

    private String paymentMethodToken;
    private String returnUrl;
}
