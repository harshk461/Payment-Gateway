package com.example.payment.modules.payment.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.example.payment.modules.payment.entity.PaymentIntent;

public interface PaymentIntentRepository extends JpaRepository<PaymentIntent, Long> {

        PaymentIntent findByMerchantIdAndIdempotencyKey(Long merchantId, String idempotencyKey);

        Optional<PaymentIntent> findById(Long id);

        // ============================
        // Dashboard Metrics (MySQL-native)
        // ============================

        @Query(value = """
                        SELECT SUM(amount)
                        FROM payment_intents
                        WHERE merchant_id = :merchantId
                        AND DATE(created_at) = CURDATE()
                        """, nativeQuery = true)
        Long getTodayVolume(Long merchantId);

        @Query(value = """
                        SELECT COUNT(*)
                        FROM payment_intents
                        WHERE merchant_id = :merchantId
                        AND DATE(created_at) = CURDATE()
                        """, nativeQuery = true)
        Long getTodayPayments(Long merchantId);

        @Query(value = """
                        SELECT COUNT(*)
                        FROM payment_intents
                        WHERE merchant_id = :merchantId
                        """, nativeQuery = true)
        Long getTotalPayments(Long merchantId);

        @Query(value = """
                        SELECT SUM(amount)
                        FROM payment_intents
                        WHERE merchant_id = :merchantId
                        """, nativeQuery = true)
        Long getTotalVolume(Long merchantId);

        @Query(value = """
                        SELECT COUNT(*)
                        FROM payment_intents
                        WHERE merchant_id = :merchantId
                        AND DATE(created_at) >= CURDATE() - INTERVAL 30 DAY
                        """, nativeQuery = true)
        Long getLast30DaysPayments(Long merchantId);

        @Query(value = """
                        SELECT * FROM payment_intents
                        WHERE id = :id AND merchant_id = :merchantId
                        LIMIT 1
                        """, nativeQuery = true)
        PaymentIntent findIntentByIdAndMerchant(Long id, Long merchantId);

        @Query(value = """
                            SELECT * FROM payment_intents p
                            WHERE p.merchant_id = :merchantId
                            AND (:status = 'all' OR p.status = :status)
                            AND (
                                :search = ''
                                OR p.id LIKE CONCAT('%', :search, '%')
                                OR p.provider_reference LIKE CONCAT('%', :search, '%')
                            )
                            ORDER BY p.created_at DESC
                        """, nativeQuery = true)
        List<PaymentIntent> searchIntents(
                        Long merchantId,
                        String status,
                        String search,
                        int limit,
                        int offset);

        @Query(value = """
                            SELECT COUNT(*) FROM payment_intents p
                            WHERE p.merchant_id = :merchantId
                            AND (:status = 'all' OR p.status = :status)
                            AND (
                                :search = ''
                                OR p.id LIKE CONCAT('%', :search, '%')
                                OR p.provider_reference LIKE CONCAT('%', :search, '%')
                            )
                        """, nativeQuery = true)
        Long countIntents(
                        Long merchantId,
                        String status,
                        String search);

}
