package com.example.payment.modules.merchant.dto;

import lombok.Data;

@Data
public class UpdateWebhookRequest {
    private String webhookUrl;
}
