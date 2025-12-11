package com.example.payment.modules.merchant.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class RegenerateKeysResponse {
    private Long merchantId;
    private String publicKey;
    private String secretKey;
}
