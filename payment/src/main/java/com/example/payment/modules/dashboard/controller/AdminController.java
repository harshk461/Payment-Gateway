package com.example.payment.modules.dashboard.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.payment.modules.dashboard.dto.AllMerchants;
import com.example.payment.modules.dashboard.dto.MerchantDetailsResponse;
import com.example.payment.modules.dashboard.dto.ShadowModeTokenResponse;
import com.example.payment.modules.dashboard.dto.UpdateWebhookRequest;
import com.example.payment.modules.dashboard.service.AdminService;
import com.example.payment.modules.merchant.dto.RegisterMerchantRequest;
import com.example.payment.modules.merchant.dto.RegisterMerchantResponse;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api/v1/admin/merchants")
public class AdminController {
    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping()
    public AllMerchants listMerchants(@RequestHeader("Authorization") String authHeader,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "all") String status,
            @RequestParam(defaultValue = "") String search) {
        return adminService.listMerchants(authHeader, page, size, status, search);

    }

    @PostMapping("/register")
    public RegisterMerchantResponse registerMerchant(@RequestBody RegisterMerchantRequest body,
            HttpServletRequest request) {
        String ip = request.getRemoteAddr();
        String ua = request.getHeader("User-Agent");
        return this.adminService.registerMerchant(body, ip, ua);
    }

    // GET /admin/merchants/{id}
    @GetMapping("/{merchantId}")
    public MerchantDetailsResponse getMerchant(@PathVariable Long merchantId) {
        return adminService.getMerchantDetails(merchantId);
    }

    // POST /admin/merchants/{id}/suspend
    @PostMapping("/{merchantId}/suspend")
    public void suspendMerchant(@PathVariable Long merchantId) {
        adminService.suspendMerchant(merchantId);
    }

    // POST /admin/merchants/{id}/activate
    @PostMapping("/{merchantId}/activate")
    public void activateMerchant(@PathVariable Long merchantId) {
        adminService.activateMerchant(merchantId);
    }

    // POST /admin/merchants/{id}/regenerate
    @PostMapping("/{merchantId}/regenerate")
    public AdminRegenerateKeysResponse regenerateKeys(@PathVariable Long merchantId) {
        return adminService.regenerateApiKeys(merchantId);
    }

    // PUT /admin/merchants/{id}/webhook
    @PutMapping("/{merchantId}/webhook")
    public void updateWebhook(@PathVariable Long merchantId,
            @RequestBody UpdateWebhookRequest req) {
        adminService.updateWebhook(merchantId, req);
    }

    // POST /admin/merchants/{id}/shadow
    @PostMapping("/{merchantId}/shadow")
    public ShadowModeTokenResponse shadowMode(@PathVariable Long merchantId) {
        return adminService.generateShadowModeToken(merchantId);
    }

}
