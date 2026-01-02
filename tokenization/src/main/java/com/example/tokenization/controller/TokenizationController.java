package com.example.tokenization.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.tokenization.dto.AuthorizeRequest;
import com.example.tokenization.dto.AuthorizeResponse;
import com.example.tokenization.dto.DetokenizedCardRequest;
import com.example.tokenization.dto.DetokenizedCardResponse;
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

    @PostMapping("/detokenize")
    public DetokenizedCardResponse detokenizeCard(@RequestBody DetokenizedCardRequest body) {
        return this.tokenizationService.detokenizeToken(body);
    }

    @PostMapping("/authorize")
    public AuthorizeResponse authorize(@RequestBody AuthorizeRequest request) {
        return this.tokenizationService.authorize(request);
    }
}
