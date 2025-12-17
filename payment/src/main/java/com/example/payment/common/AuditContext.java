package com.example.payment.common;

public class AuditContext {

    private static final ThreadLocal<Long> merchantHolder = new ThreadLocal<>();

    public static void setCurrentMerchant(Long merchantId) {
        merchantHolder.set(merchantId);
    }

    public static Long getMerchantId() {
        return merchantHolder.get();
    }

    public static void clear() {
        merchantHolder.remove();
    }
}
