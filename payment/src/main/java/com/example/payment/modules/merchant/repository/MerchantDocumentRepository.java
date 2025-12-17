package com.example.payment.modules.merchant.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.payment.modules.merchant.entity.MerchantDocument;

public interface MerchantDocumentRepository extends JpaRepository<MerchantDocument, Long> {
    List<MerchantDocument> findByMerchantId(Long merchantId);
}
