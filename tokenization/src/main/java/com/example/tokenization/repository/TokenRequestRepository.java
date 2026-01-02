package com.example.tokenization.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.tokenization.entity.TokenRequest;

public interface TokenRequestRepository extends JpaRepository<TokenRequest, Long> {

}
