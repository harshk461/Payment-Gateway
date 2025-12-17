package com.example.payment.modules.dashboard.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class MerchantDetailsResponse {

    private Long id;
    private String name;
    private String businessName;
    private String email;

    private String webhookUrl;
    private String status;

    private int riskScore;

    private String publicKey;
    private String secretKeyMasked;
    private String secretKey;

    private List<DocumentInfo> documents;

    @Data
    @Builder
    public static class DocumentInfo {
        private String name;
        private String status; // VERIFIED, PENDING, REJECTED
    }
}
