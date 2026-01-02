package com.example.payment.modules.payment.connector;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ConnectorResponse {

    private boolean success;
    private String providerReference;
    private String failureReason;

    private String cardNetwork;
    private String upiApp;
    private String walletProvider;
    private String bankCode;

    public ConnectorResponse(boolean success, String providerReference) {
        this.success = success;
        this.providerReference = providerReference;
    }

    public static ConnectorResponse failed(String reason) {
        ConnectorResponse r = new ConnectorResponse(false, null);
        r.setFailureReason(reason);
        return r;
    }
}
