package com.example.payment.modules.payment.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.payment.modules.payment.entity.PaymentMethod;

public interface PaymentMethodReposiory extends JpaRepository<PaymentMethod, Long> {

}
