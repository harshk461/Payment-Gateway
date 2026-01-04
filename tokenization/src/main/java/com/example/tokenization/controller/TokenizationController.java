package com.example.tokenization.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.tokenization.dto.ResolveTokenRequest;
import com.example.tokenization.dto.ResolveTokenResponse;
import com.example.tokenization.dto.TokenizeCardRequest;
import com.example.tokenization.service.TokenizationService;

import java.util.Map;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("/api/v1/tokenization")
public class TokenizationController {
    private final TokenizationService tokenizationService;

    public TokenizationController(TokenizationService tokenizationService) {
        this.tokenizationService = tokenizationService;
    }

    @PostMapping("/tokenize-card")
    public Map<String, String> tokenizeCard(@RequestBody TokenizeCardRequest entity) {
        String token = tokenizationService.tokenizeCard(entity);
        return Map.of("token", token);
    }

    @PostMapping("/resolve")
    public ResolveTokenResponse resolveCard(@RequestBody ResolveTokenRequest entity) {
        return this.tokenizationService.resolveToken(entity.getPaymentMethodToken());
    }
}
