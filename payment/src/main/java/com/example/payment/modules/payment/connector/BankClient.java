package com.example.payment.modules.payment.connector;

import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import com.example.payment.modules.payment.dto.BankAuthorizeRequest;
import com.example.payment.modules.payment.dto.BankAuthorizeResponse;
import com.example.payment.modules.payment.dto.BankCaptureRequest;
import com.example.payment.modules.payment.dto.BankCaptureResponse;

@Component
public class BankClient {

    private final RestTemplate restTemplate = new RestTemplate();

    public BankAuthorizeResponse authorize(BankAuthorizeRequest request) {
        return restTemplate.postForObject(
                "http://localhost:3004/authorization/authorize",
                request,
                BankAuthorizeResponse.class);
    }

    public BankCaptureResponse capture(BankCaptureRequest request) {
        return restTemplate.postForObject(
                "http://localhost:3004/authorization/capture",
                request,
                BankCaptureResponse.class);
    }
}
