package com.example.payment.modules.dashboard.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class PaymentDetailsResponse {

    private String id;
    private Long amount;
    private String currency;
    private String status;
    private String method;
    private String providerReference;

    private String createdAt;
    private String updatedAt;
    private Integer attempts;

    private CustomerInfo customer;
    private String metadata;

    private List<TimelineItem> timeline;

    @Data
    @Builder
    public static class CustomerInfo {
        private String name;
        private String email;
    }

    @Data
    @Builder
    public static class TimelineItem {
        private String label;
        private String at;
        private String description;
    }
}
