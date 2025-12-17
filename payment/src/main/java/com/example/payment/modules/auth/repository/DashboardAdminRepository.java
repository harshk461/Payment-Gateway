package com.example.payment.modules.auth.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.payment.modules.auth.entity.DashboardAdmin;

public interface DashboardAdminRepository extends JpaRepository<DashboardAdmin, Long> {
    DashboardAdmin findByEmail(String email);

    DashboardAdmin findByResetToken(String token);

    boolean existsByEmail(String email);
}
