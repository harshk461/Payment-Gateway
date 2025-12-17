package com.example.payment.modules.payment.repository;

import java.util.List;
import java.util.Map;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.example.payment.modules.payment.entity.PaymentTransaction;

public interface PaymentTransactionRepository extends JpaRepository<PaymentTransaction, Long> {

    Integer countByIntentId(Long id);

    // ===============================
    // Dashboard Metrics (MySQL native)
    // ===============================

    @Query(value = """
            SELECT COUNT(*)
            FROM payment_transactions
            WHERE merchant_id = :merchantId
            AND status = 'SUCCESS'
            AND DATE(created_at) = CURDATE()
            """, nativeQuery = true)
    Long getTodaySuccess(Long merchantId);

    @Query(value = """
            SELECT COUNT(*)
            FROM payment_transactions
            WHERE merchant_id = :merchantId
            AND status = 'FAILED'
            AND DATE(created_at) = CURDATE()
            """, nativeQuery = true)
    Long getTodayFailed(Long merchantId);

    // Revenue chart
    @Query(value = """
            SELECT
                DATE(t.created_at) AS date,
                SUM(t.amount) AS amount
            FROM payment_transactions t
            WHERE t.merchant_id = :merchantId
            AND DATE(t.created_at) >= (CURDATE() - INTERVAL :days DAY)
            GROUP BY DATE(t.created_at)
            ORDER BY DATE(t.created_at)
            """, nativeQuery = true)
    List<Map<String, Object>> getRevenueChart(Long merchantId, int days);

    List<PaymentTransaction> findTop10ByMerchantIdOrderByCreatedAtDesc(Long merchantId);

    // ===============================
    // Search + Pagination
    // ===============================

    @Query(value = """
            SELECT * FROM payment_transactions t
            WHERE t.merchant_id = :merchantId
            AND (:status = 'all' OR t.status = :status)
            AND (
                :search = ''
                OR t.provider_reference LIKE CONCAT('%', :search, '%')
                OR CAST(t.id AS CHAR) LIKE CONCAT('%', :search, '%')
            )
            ORDER BY t.created_at DESC
            """, nativeQuery = true)
    List<PaymentTransaction> searchPayments(
            Long merchantId,
            String status,
            String search,
            Integer limit,
            Integer offset);

    @Query(value = """
            SELECT COUNT(*)
            FROM payment_transactions t
            WHERE t.merchant_id = :merchantId
            AND (:status = 'all' OR t.status = :status)
            AND (
                :search = ''
                OR t.provider_reference LIKE CONCAT('%', :search, '%')
                OR t.id LIKE CONCAT('%', :search, '%')
            )
            """, nativeQuery = true)
    Long countPayments(
            Long merchantId,
            String status,
            String search);

    @Query(value = """
            SELECT * FROM payment_transactions
            WHERE intent_id = :intentId
            ORDER BY created_at ASC
            """, nativeQuery = true)
    List<PaymentTransaction> findAllByIntentIdOrdered(Long intentId);

    @Query(value = """
            SELECT COALESCE(SUM(amount),0) FROM payment_transactions t
            WHERE t.merchant_id = :merchantId
            """, nativeQuery = true)
    Long getTotalVolumeByMerchant(Long merchantId);

    @Query(value = """
            SELECT COALESCE(SUM(amount),0) FROM payment_transactions t
            WHERE t.merchant_id = :merchantId
            AND DATE(t.created_at) >= CURDATE() - INTERVAL :days DAY
            """, nativeQuery = true)
    Long getVolumeLastDays(Long merchantId, int days);

    @Query(value = """
            SELECT COUNT(*) FROM payment_transactions t
            WHERE t.merchant_id = :merchantId
            AND t.status = 'FAILED'
            AND DATE(t.created_at) >= CURDATE() - INTERVAL :days DAY
            """, nativeQuery = true)
    Long countFailedInLastDays(Long merchantId, int days);

    @Query(value = """
            SELECT COUNT(*) FROM payment_transactions t
            WHERE t.merchant_id = :merchantId
            AND t.status = 'FAILED'
            """, nativeQuery = true)
    Long countTotalFailed(Long merchantId);
}
