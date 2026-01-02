package com.example.tokenization.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;

@Entity
@Table(name = "audit_logs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuditLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String actor; // SYSTEM / PG

    private String action; // TOKEN_CREATE / AUTHORIZE

    private String referenceId;

    private String token;

    private String purpose;

    private Instant createdAt;
}
