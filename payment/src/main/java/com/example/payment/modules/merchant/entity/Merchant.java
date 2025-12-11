package com.example.payment.modules.merchant.entity;

import com.example.payment.common.BaseEntity;
import com.example.payment.core.enums.MerchantStatus;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "merchants")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Merchant extends BaseEntity {
    @Column(nullable = false)
    private String name; // Owner / person name

    @Column(nullable = false)
    private String businessName; // Visible in checkout UI

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false, unique = true)
    private String publicKey; // Used in frontend checkout SDK

    @Column(nullable = false, unique = true)
    private String secretKey; // Used for server-side authenticated API calls

    @Column
    private String webhookUrl; // Merchant's webhook receiver URL

    @Enumerated(EnumType.STRING)
    private MerchantStatus status; // ACTIVE / DISABLED
}
