
package com.example.tokenization.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.tokenization.entity.BankTransaction;

public interface BankTransactionRepository extends JpaRepository<BankTransaction, Long> {

}
