package com.example.payment.modules.merchant.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.payment.modules.merchant.dto.ToggleProfileResponse;
import com.example.payment.modules.merchant.dto.UpdateProfileRequest;
import com.example.payment.modules.merchant.dto.ApiKeysResponse;
import com.example.payment.modules.merchant.dto.ProfileResponse;
import com.example.payment.modules.merchant.dto.RegenerateKeysResponse;
import com.example.payment.modules.merchant.dto.RegisterMerchantRequest;
import com.example.payment.modules.merchant.dto.RegisterMerchantResponse;
import com.example.payment.modules.merchant.dto.UpdateWebhookRequest;
import com.example.payment.modules.merchant.dto.UpdateWebhookResponse;
import com.example.payment.modules.merchant.service.MerchantService;

@RestController
@RequestMapping("/api/v1/merchants")
public class MerchantController {
    private final MerchantService merchantService;

    public MerchantController(MerchantService merchantService) {
        this.merchantService = merchantService;
    }

    @GetMapping("/me")
    public ProfileResponse getMerchantProfile(@RequestHeader("Authorization") String authHeader) {
        return this.merchantService.getMerchantProfile(authHeader);
    }

    @PutMapping("/me")
    public ProfileResponse updateMerchantProfile(@RequestHeader("Authorization") String authHeader,
            @RequestBody UpdateProfileRequest req) {
        return this.merchantService.updateMerchantProfile(authHeader, req);
    }

    @PutMapping("/webhook")
    public UpdateWebhookResponse updateWebhookUrl(@RequestBody UpdateWebhookRequest body,
            @RequestHeader("Authorization") String authHeader) {
        return this.merchantService.updateWebhookUrl(body, authHeader);
    }

    @PostMapping("/regenerate")
    public RegenerateKeysResponse regenerateKeys(@RequestHeader("Authorization") String authHeader) {
        return this.merchantService.regenerateKeys(authHeader);
    }

    @PutMapping("/disable")
    public ToggleProfileResponse disableMerchant(@RequestHeader("Authorization") String authHeader) {
        return this.merchantService.disableMerchant(authHeader);
    }

    @PutMapping("/enable")
    public ToggleProfileResponse enableMerchant(@RequestHeader("Authorization") String authHeader) {
        return this.merchantService.enableMerchant(authHeader);
    }

    @GetMapping("/api-keys")
    public ApiKeysResponse getApiKeys(@RequestHeader("Authorization") String authHeader) {
        return merchantService.getApiKeys(authHeader);
    }
}
