package com.example.payment.modules.payment.service;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.example.payment.modules.payment.dto.WebhookPayload;

import tools.jackson.databind.ObjectMapper;

@Service
public class WebhookEmitter {

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    public boolean emit(
            String webhookUrl,
            WebhookPayload payload,
            String secret) {
        try {
            String body = objectMapper.writeValueAsString(payload);
            String signature = WebhookSignatureUtil.generateSignature(body, secret);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("X-Payment-Signature", signature);

            HttpEntity<String> entity = new HttpEntity<>(body, headers);
            ResponseEntity<String> response = restTemplate.postForEntity(webhookUrl, entity, String.class);

            return response.getStatusCode().is2xxSuccessful();
        } catch (Exception e) {
            return false;
        }
    }

    public void emitWithRetry(
            String webhookUrl,
            WebhookPayload payload,
            String secret) {
        for (int i = 1; i <= 3; i++) {
            if (emit(webhookUrl, payload, secret)) {
                return;
            }
            try {
                Thread.sleep(2000L * i);
            } catch (InterruptedException ignored) {
            }
        }
    }
}
