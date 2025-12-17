package com.example.payment.modules.dashboard.service;

import com.example.payment.common.AuditContext;
import com.example.payment.exception.PaymentException;
import com.example.payment.modules.dashboard.dto.*;
import com.example.payment.modules.payment.entity.PaymentIntent;
import com.example.payment.modules.payment.entity.PaymentTransaction;
import com.example.payment.modules.payment.repository.PaymentIntentRepository;
import com.example.payment.modules.payment.repository.PaymentTransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final PaymentIntentRepository intentRepo;
    private final PaymentTransactionRepository txnRepo;

    public TodayStatsResponse getTodayStats() {
        Long merchantId = AuditContext.getMerchantId();

        Long volume = intentRepo.getTodayVolume(merchantId);
        Long count = intentRepo.getTodayPayments(merchantId);

        Long success = txnRepo.getTodaySuccess(merchantId);
        Long failed = txnRepo.getTodayFailed(merchantId);

        double successRate = (count == 0) ? 0 : (success * 100.0 / count);

        return TodayStatsResponse.builder()
                .todayVolume(volume == null ? 0 : volume)
                .todayPayments(count == null ? 0 : count)
                .todaySuccessRate(successRate)
                .failedCount(failed == null ? 0 : failed)
                .growth(12.4) // static for now
                .build();
    }

    public OverallStatsResponse getOverallStats() {
        Long merchantId = AuditContext.getMerchantId();

        Long totalVolume = intentRepo.getTotalVolume(merchantId);
        Long totalPayments = intentRepo.getTotalPayments(merchantId);
        Long last30 = intentRepo.getLast30DaysPayments(merchantId);

        return OverallStatsResponse.builder()
                .totalVolume(totalVolume == null ? 0 : totalVolume)
                .totalPayments(totalPayments == null ? 0 : totalPayments)
                .last30DaysPayments(last30 == null ? 0 : last30)
                .growth(3.4)
                .build();
    }

    public RevenueChartResponse getRevenueChart(String range) {
        Long merchantId = AuditContext.getMerchantId();
        int days = range.equals("30d") ? 30 : 7;

        List<Map<String, Object>> raw = txnRepo.getRevenueChart(merchantId, days);

        List<RevenuePoint> points = raw.stream()
                .map(m -> RevenuePoint.builder()
                        .date(m.get("date").toString())
                        .amount(Long.parseLong(m.get("amount").toString()))
                        .build())
                .collect(Collectors.toList());

        return RevenueChartResponse.builder()
                .range(range)
                .points(points)
                .build();
    }

    public TodayPerformanceResponse getTodayPerformance() {
        Long merchantId = AuditContext.getMerchantId();

        Long success = txnRepo.getTodaySuccess(merchantId);
        Long failed = txnRepo.getTodayFailed(merchantId);
        Long revenue = intentRepo.getTodayVolume(merchantId);

        long totalPayments = (success == null ? 0 : success) + (failed == null ? 0 : failed);
        double avg = totalPayments == 0 ? 0 : (revenue * 1.0 / totalPayments);

        return TodayPerformanceResponse.builder()
                .todayRevenue(revenue == null ? 0 : revenue)
                .successfulPayments(success == null ? 0 : success)
                .failedPayments(failed == null ? 0 : failed)
                .avgTicketSize(avg)
                .build();
    }

    public RecentPaymentsResponse getRecentPayments(int limit) {
        Long merchantId = AuditContext.getMerchantId();

        List<PaymentTransaction> txns = txnRepo.findTop10ByMerchantIdOrderByCreatedAtDesc(merchantId);

        List<RecentPaymentRow> rows = txns.stream()
                .map(t -> RecentPaymentRow.builder()
                        .paymentId("pay_" + t.getId())
                        .customer("Guest")
                        .method(t.getConnector())
                        .amount(t.getAmount())
                        .status(t.getStatus().name())
                        .timeAgo(formatTimeAgo(t.getCreatedAt()))
                        .build())
                .collect(Collectors.toList());

        return RecentPaymentsResponse.builder().payments(rows).build();
    }

    private String formatTimeAgo(LocalDateTime createdAt) {
        Duration diff = Duration.between(createdAt, LocalDateTime.now());
        long minutes = diff.toMinutes();
        if (minutes < 1)
            return "just now";
        if (minutes < 60)
            return minutes + " min ago";
        long hours = diff.toHours();
        if (hours < 24)
            return hours + " hr ago";
        return diff.toDays() + " days ago";
    }

    public GatewayHealthResponse getGatewayHealth() {
        TodayStatsResponse today = getTodayStats();

        String status = today.getTodaySuccessRate() > 95 ? "HEALTHY" : "DEGRADED";
        String msg = today.getTodaySuccessRate() > 95 ? "Success rate is above 95%, gateway is healthy"
                : "Gateway performance lower than usual";

        return GatewayHealthResponse.builder()
                .successRate(today.getTodaySuccessRate())
                .providerStatus(status)
                .message(msg)
                .build();
    }

    public PaymentsPageResponse getPayments(int page, int size, String status, String search) {

        Long merchantId = AuditContext.getMerchantId();
        if (merchantId == null)
            throw new PaymentException("Unauthorized");

        int offset = (page - 1) * size;

        // FIX → Use intents, not transactions
        List<PaymentIntent> rows = intentRepo.searchIntents(
                merchantId,
                status,
                search == null ? "" : search,
                size,
                offset);

        Long total = intentRepo.countIntents(
                merchantId,
                status,
                search == null ? "" : search);

        List<PaymentRow> list = rows.stream().map(intent -> PaymentRow.builder()
                .id("pay_" + intent.getId()) // UI-friendly
                .intentId(intent.getId())
                .amount(intent.getAmount())
                .currency(intent.getCurrency())
                .status(intent.getStatus().name())
                .method(intent.getPaymentMethod())
                .customer("Guest User")
                .createdAt(intent.getCreatedAt())
                .build()).toList();

        return PaymentsPageResponse.builder()
                .page(page)
                .size(size)
                .total(total)
                .payments(list)
                .build();
    }

    public PaymentDetailsResponse getPaymentDetails(Long paymentId) {

        Long merchantId = AuditContext.getMerchantId();

        PaymentIntent intent = intentRepo.findIntentByIdAndMerchant(paymentId, merchantId);
        if (intent == null) {
            throw new RuntimeException("Payment not found");
        }

        List<PaymentTransaction> transactions = txnRepo.findAllByIntentIdOrdered(intent.getId());

        // Build timeline items
        List<PaymentDetailsResponse.TimelineItem> timeline = new ArrayList<>();

        timeline.add(PaymentDetailsResponse.TimelineItem.builder()
                .label("Created")
                .at(intent.getCreatedAt().toString())
                .description("Payment intent created")
                .build());

        for (PaymentTransaction t : transactions) {
            timeline.add(PaymentDetailsResponse.TimelineItem.builder()
                    .label(t.getStatus().name())
                    .at(t.getCreatedAt().toString())
                    .description("Provider event: " + t.getStatus())
                    .build());
        }

        String finalStatus = transactions.isEmpty()
                ? intent.getStatus().name()
                : transactions.get(transactions.size() - 1).getStatus().name();

        return PaymentDetailsResponse.builder()
                .id(intent.getId().toString())
                .amount(intent.getAmount())
                .currency(intent.getCurrency())
                .status(finalStatus)
                .method(intent.getPaymentMethod())
                .providerReference(intent.getProviderReference())
                .createdAt(intent.getCreatedAt().toString())
                .updatedAt(intent.getUpdatedAt().toString())
                .attempts(transactions.size())
                .customer(PaymentDetailsResponse.CustomerInfo.builder()
                        .name("Dummy User")
                        .email("dummy@gmail.com")
                        .build())
                .metadata(intent.getMetadata())
                .timeline(timeline)
                .build();
    }
}
