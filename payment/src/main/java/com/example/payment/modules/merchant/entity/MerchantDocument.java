package com.example.payment.modules.merchant.entity;

import org.springframework.data.annotation.Id;

import com.example.payment.common.BaseEntity;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "merchant_documents")
@Data
public class MerchantDocument extends BaseEntity {
    private Long merchantId;
    private String name;

    @Enumerated(EnumType.STRING)
    private DocStatus status;

    public enum DocStatus {
        VERIFIED,
        PENDING,
        REJECTED
    }
}
