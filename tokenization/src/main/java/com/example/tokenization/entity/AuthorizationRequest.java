package com.example.tokenization.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;

@Entity
@Table(name = "authorization_requests")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuthorizationRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String authorizationId;

    @Column(nullable = false)
    private String token;

    @Column(nullable = false)
    private Long amount;

    @Column(nullable = false)
    private String currency;

    private String merchantId;

    private String status; // AUTHORIZED / DECLINED

    private String bankRrn;

    private String reasonCode;

    private Instant createdAt;
}
