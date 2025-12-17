package com.example.payment.modules.dashboard.dto;

import java.util.List;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class PaymentsPageResponse {
    private int page;
    private int size;
    private Long total;
    private List<PaymentRow> payments;
}
