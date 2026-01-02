package com.example.tokenization.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;

@Entity
@Table(name = "bank_transactions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BankTransaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String authorizationId;

    private String bankName;

    @Lob
    private String requestPayload; // MASKED

    @Lob
    private String responsePayload; // MASKED

    private Long latencyMs;

    private String status; // SUCCESS / FAIL

    private Instant createdAt;
}
