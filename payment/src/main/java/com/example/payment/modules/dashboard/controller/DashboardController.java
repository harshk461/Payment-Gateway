package com.example.payment.modules.dashboard.controller;

import com.example.payment.modules.dashboard.dto.*;
import com.example.payment.modules.dashboard.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/stats/today")
    public TodayStatsResponse todayStats() {
        return dashboardService.getTodayStats();
    }

    @GetMapping("/stats/overall")
    public OverallStatsResponse overallStats() {
        return dashboardService.getOverallStats();
    }

    @GetMapping("/revenue")
    public RevenueChartResponse revenue(@RequestParam(defaultValue = "7d") String range) {
        return dashboardService.getRevenueChart(range);
    }

    @GetMapping("/performance/today")
    public TodayPerformanceResponse todayPerformance() {
        return dashboardService.getTodayPerformance();
    }

    @GetMapping("/payments/recent")
    public RecentPaymentsResponse recent(@RequestParam(defaultValue = "10") int limit) {
        return dashboardService.getRecentPayments(limit);
    }

    @GetMapping("/health")
    public GatewayHealthResponse health() {
        return dashboardService.getGatewayHealth();
    }

    @GetMapping("/payments")
    public PaymentsPageResponse getPayments(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "all") String status,
            @RequestParam(defaultValue = "") String search) {
        return dashboardService.getPayments(page, size, status, search);
    }

    @GetMapping("/payments/{id}")
    public PaymentDetailsResponse getPayment(@PathVariable Long id) {
        return dashboardService.getPaymentDetails(id);
    }
}
