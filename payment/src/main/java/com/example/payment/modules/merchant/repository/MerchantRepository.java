package com.example.payment.modules.merchant.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.payment.modules.merchant.entity.Merchant;

public interface MerchantRepository extends JpaRepository<Merchant, Long> {
  Merchant findByEmail(String email);

  Merchant findByWebhookUrl(String webhookUrl);

  Merchant findBySecretKey(String secretKey);

  // Paginated search (native MySQL for ease)
  @Query(value = """
      SELECT *
      FROM merchants m
      WHERE (:status = 'all' OR m.status = :status)
        AND (
          :search = ''
          OR LOWER(m.name) LIKE LOWER(CONCAT('%', :search, '%'))
          OR LOWER(m.business_name) LIKE LOWER(CONCAT('%', :search, '%'))
          OR LOWER(m.email) LIKE LOWER(CONCAT('%', :search, '%'))
        )
        ORDER BY m.created_at DESC
      """, nativeQuery = true)
  List<Merchant> searchMerchants(
      @Param("status") String status,
      @Param("search") String search,
      @Param("limit") int limit,
      @Param("offset") int offset);

  @Query(value = """
      SELECT COUNT(*) FROM merchants m
      WHERE (:status = 'all' OR m.status = :status)
        AND (
          :search = ''
          OR LOWER(m.name) LIKE LOWER(CONCAT('%', :search, '%'))
          OR LOWER(m.business_name) LIKE LOWER(CONCAT('%', :search, '%'))
          OR LOWER(m.email) LIKE LOWER(CONCAT('%', :search, '%'))
        )
      """, nativeQuery = true)
  Long countSearchMerchants(@Param("status") String status, @Param("search") String search);
}