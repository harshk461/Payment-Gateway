package com.example.payment.modules.payment.connector;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ConnectorResponse {
    private boolean success;
    private String providerReference;
}
