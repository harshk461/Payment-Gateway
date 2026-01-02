
package com.example.tokenization.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.tokenization.entity.EncryptionKey;

public interface EncryptionKeyRepository extends JpaRepository<EncryptionKey, Long> {

}
