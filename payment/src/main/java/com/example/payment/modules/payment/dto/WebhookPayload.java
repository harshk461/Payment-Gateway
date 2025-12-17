package com.example.payment.modules.payment.dto;

import java.time.Instant;
import java.util.Map;

public class WebhookPayload {

    private String event;
    private Map<String, Object> data;
    private long timestamp;
    private String metadata;

    public WebhookPayload(String event, Map<String, Object> data, String metadata) {
        this.event = event;
        this.data = data;
        this.metadata = metadata;
        this.timestamp = Instant.now().getEpochSecond();
    }

    public String getEvent() {
        return event;
    }

    public Map<String, Object> getData() {
        return data;
    }

    public long getTimestamp() {
        return timestamp;
    }

    public String getMetadata() {
        return metadata;
    }
}
