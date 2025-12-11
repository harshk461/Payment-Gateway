package com.example.payment.modules.merchant.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ToggleProfileResponse {
    private Long merchantId;
    private String message;
    private String status;
}
