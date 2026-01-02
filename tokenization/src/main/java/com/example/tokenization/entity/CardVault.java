package com.example.tokenization.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;

@Entity
@Table(name = "card_vault", indexes = {
        @Index(name = "idx_token", columnList = "token"),
        @Index(name = "idx_last4", columnList = "panLast4")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CardVault {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 64)
    private String token;

    @Lob
    @Column(name = "encrypted_pan", nullable = false)
    private String encryptedPan;

    @Lob
    @Column(name = "encrypted_cvv")
    private String encryptedCvv; // ⚠️ Learning only

    @Column(nullable = false)
    private Integer expMonth;

    @Column(nullable = false)
    private Integer expYear;

    @Column(length = 4, nullable = false)
    private String panLast4;

    @Column(nullable = false, length = 20)
    private String cardNetwork; // VISA, MASTERCARD

    @Column(length = 100)
    private String cardHolderName;

    @Column(nullable = false)
    private String status; // ACTIVE / REVOKED

    private Instant expiresAt;

    private Instant createdAt;

    private Boolean active;
}
