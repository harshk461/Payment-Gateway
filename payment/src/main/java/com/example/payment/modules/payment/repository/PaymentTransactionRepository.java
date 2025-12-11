package com.example.payment.modules.payment.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.payment.modules.payment.entity.PaymentTransaction;

public interface PaymentTransactionRepository extends JpaRepository<PaymentTransaction, Long> {
    Integer countByIntentId(Long id);
}
