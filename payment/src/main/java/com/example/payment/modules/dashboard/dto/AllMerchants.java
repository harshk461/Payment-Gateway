package com.example.payment.modules.dashboard.dto;

import java.util.List;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AllMerchants {
    private Integer page;
    private Integer size;
    private Long total;
    private List<MerchantRow> merchants;
}
