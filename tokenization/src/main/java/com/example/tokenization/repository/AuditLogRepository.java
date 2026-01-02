package com.example.tokenization.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.tokenization.entity.AuditLog;

public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {

}
