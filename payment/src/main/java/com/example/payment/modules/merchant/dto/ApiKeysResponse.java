package com.example.payment.modules.merchant.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ApiKeysResponse {
    private String publicKey;
    private String secretKey;
    private String iv;
    private String keyVersion;

}
