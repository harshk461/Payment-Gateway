package com.example.payment.modules.payment.dto;

import java.time.Instant;
import java.util.Map;
import java.util.UUID;

import lombok.Getter;

@Getter
public class WebhookPayload {

    /** Unique webhook event ID */
    private final String id;

    /** Event type (payment_intent.succeeded etc.) */
    private final String event;

    /** API version */
    private final String version;

    /** Event creation timestamp (epoch millis) */
    private final long createdAt;

    /** Event payload */
    private final Data data;

    /** Optional metadata */
    private final Map<String, Object> metadata;

    // ---------------- CONSTRUCTOR ----------------

    public WebhookPayload(
            String event,
            Map<String, Object> object,
            Map<String, Object> metadata,
            String version) {
        this.id = "evt_" + UUID.randomUUID().toString().replace("-", "");
        this.event = event;
        this.version = version;
        this.createdAt = Instant.now().toEpochMilli();
        this.data = new Data(object);
        this.metadata = metadata;
    }

    // ---------------- INNER DATA WRAPPER ----------------

    @Getter
    public static class Data {
        private final String object = "payment_intent";
        private final Map<String, Object> attributes;

        public Data(Map<String, Object> attributes) {
            this.attributes = attributes;
        }
    }
}
