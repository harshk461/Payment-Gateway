package com.example.tokenization.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class BankAuthorizeResponse {

    private boolean approved; // true / false

    private String status; // AUTHORIZED | DECLINED

    private String bankReference; // unique auth reference

    private String declineReason; // only if declined
}
