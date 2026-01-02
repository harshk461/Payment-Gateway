package com.example.tokenization.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;

@Entity
@Table(name = "encryption_keys")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EncryptionKey {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String keyAlias; // AES_V1

    @Lob
    private String encryptedKey;

    private String status; // ACTIVE / RETIRED

    private Instant createdAt;
}
