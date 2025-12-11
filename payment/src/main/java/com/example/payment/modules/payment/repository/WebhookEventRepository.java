package com.example.payment.modules.payment.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.payment.modules.payment.entity.WebhookEvent;

public interface WebhookEventRepository extends JpaRepository<WebhookEvent, Long> {

}
