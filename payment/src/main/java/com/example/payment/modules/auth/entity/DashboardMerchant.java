package com.example.payment.modules.auth.entity;

import com.example.payment.common.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "dashboard_merchants")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DashboardMerchant extends BaseEntity {

    @Column(nullable = false, unique = true)
    private Long merchantId; // maps to merchants table

    @Column(nullable = false, unique = true)
    private String email; // dashboard login email

    @Column(nullable = false)
    private String passwordHash; // hashed password (BCrypt)

    @Column(nullable = false)
    private Boolean enabled; // can login or not

    @Column
    private String lastLoginIp;

    @Column
    private String lastLoginUserAgent;

    @Column
    private String otpSecret; // for 2FA (optional)

    @Column
    private String resetToken; // for forgot-password workflow
}
