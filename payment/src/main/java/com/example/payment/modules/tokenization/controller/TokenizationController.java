package com.example.payment.modules.tokenization.controller;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.payment.modules.tokenization.dto.CreateTokenRequest;
import com.example.payment.modules.tokenization.dto.CreateTokenResponse;
import com.example.payment.modules.tokenization.service.TokenizationService;

@RestController
@RequestMapping("/api/v1/tokenize")
public class TokenizationController {
    private final TokenizationService tokenizationService;

    public TokenizationController(TokenizationService tokenizationService) {
        this.tokenizationService = tokenizationService;
    }

    @PostMapping("/payment-token")
    public CreateTokenResponse createPaymentMethodToken(@RequestBody CreateTokenRequest dto) {
        return this.tokenizationService.createPaymentMethodToken(dto);
    }
}
