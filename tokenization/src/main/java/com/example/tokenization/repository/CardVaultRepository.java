package com.example.tokenization.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.tokenization.entity.CardVault;

public interface CardVaultRepository extends JpaRepository<CardVault, Long> {
    boolean existsByToken(String token);

    Optional<CardVault> findByToken(String token);
}
