package com.example.tokenization.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.tokenization.entity.IdempotencyKey;

public interface IdempotencyKeyRepository extends JpaRepository<IdempotencyKey, String> {

}
