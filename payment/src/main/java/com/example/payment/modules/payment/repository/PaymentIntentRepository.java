package com.example.payment.modules.payment.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.payment.modules.payment.entity.PaymentIntent;

public interface PaymentIntentRepository extends JpaRepository<PaymentIntent, Long> {
    PaymentIntent findByMerchantIdAndIdempotencyKey(Long merchantId, String idempotencyKey);

    Optional<PaymentIntent> findById(Long id);
}
