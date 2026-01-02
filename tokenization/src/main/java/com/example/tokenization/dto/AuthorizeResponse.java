package com.example.tokenization.dto;

import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class AuthorizeResponse {
    private boolean authorized;
    private String bankReference;
    private String status;
    private String reason;
}
