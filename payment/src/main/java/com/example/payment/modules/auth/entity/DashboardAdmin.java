package com.example.payment.modules.auth.entity;

import com.example.payment.common.BaseEntity;
import com.example.payment.core.enums.AdminRole;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "dashboard_admins")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DashboardAdmin extends BaseEntity {

    @Column(nullable = false, unique = true)
    private String email; // admin login email

    @Column(nullable = false)
    private String passwordHash; // BCrypt hashed password

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AdminRole role; // SUPERADMIN / SUPPORT / ENGINEER

    @Column(nullable = false)
    private Boolean enabled; // admin blocked or active

    @Column
    private String lastLoginIp;

    @Column
    private String lastLoginUserAgent;

    @Column
    private String otpSecret; // optional Google Authenticator MFA

    @Column
    private String resetToken; // used for forgot password process
}
