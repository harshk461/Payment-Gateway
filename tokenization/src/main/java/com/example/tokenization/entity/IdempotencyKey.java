package com.example.tokenization.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;

@Entity
@Table(name = "idempotency_keys")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class IdempotencyKey {

    @Id
    @Column(length = 64)
    private String key;

    @Column(nullable = false)
    private String requestHash;

    @Lob
    private String responseBody;

    private Instant createdAt;
}
