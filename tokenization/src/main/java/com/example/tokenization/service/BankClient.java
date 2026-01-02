package com.example.tokenization.service;

import com.example.tokenization.dto.BankAuthorizeRequest;
import com.example.tokenization.dto.BankAuthorizeResponse;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

@Slf4j
@Component
public class BankClient {

    private final WebClient webClient;

    public BankClient(WebClient.Builder builder) {
        this.webClient = builder
                .baseUrl("http://localhost:3004")
                .build();
    }

    public BankAuthorizeResponse authorize(BankAuthorizeRequest request) {
        try {
            log.info("Calling Bank authorize API for merchantId={}", request.getMerchantId());

            // return webClient
            // .post()
            // .uri("/api/v1/bank/authorize")
            // .bodyValue(request)
            // .retrieve()
            // .bodyToMono(BankAuthorizeResponse.class)
            // .block(); // blocking for now (fine for learning)

            return BankAuthorizeResponse.builder()
                    .approved(true)
                    .bankReference("bank_dummy_test")
                    .declineReason("none")
                    .status("BANK_AUTHORIZED_787")
                    .build();

        } catch (Exception ex) {
            log.error("Bank authorization failed", ex);

            return BankAuthorizeResponse.builder()
                    .approved(false)
                    .status("DECLINED")
                    .declineReason("BANK_UNAVAILABLE")
                    .build();
        }
    }
}
