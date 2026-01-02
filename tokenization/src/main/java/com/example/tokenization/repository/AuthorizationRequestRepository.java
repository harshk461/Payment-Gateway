package com.example.tokenization.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.tokenization.entity.AuthorizationRequest;

public interface AuthorizationRequestRepository extends JpaRepository<AuthorizationRequest, Long> {
}
