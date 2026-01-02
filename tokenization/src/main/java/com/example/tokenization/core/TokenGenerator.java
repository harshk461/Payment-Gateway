package com.example.tokenization.core;

import java.util.UUID;

import org.springframework.stereotype.Component;

@Component
public class TokenGenerator {

    public String generateToken() {
        return "tok_" + UUID.randomUUID().toString().replace("-", "");
    }
}
