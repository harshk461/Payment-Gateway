package com.example.payment.common;

public class AuditContext {

    private static final ThreadLocal<Long> currentMerchantId = new ThreadLocal<>();

    public static void setCurrentMerchant(Long merchantId) {
        currentMerchantId.set(merchantId);
    }

    public static Long getMerchantId() {
        return currentMerchantId.get();
    }

    public static void clear() {
        currentMerchantId.remove();
    }
}
