package com.example.payment.modules.merchant.service;

import java.util.Base64;

import javax.crypto.SecretKey;

import org.springframework.stereotype.Service;

import com.example.payment.common.CryptoUtil;
import com.example.payment.core.enums.MerchantStatus;
import com.example.payment.exception.PaymentException;
import com.example.payment.modules.merchant.dto.ToggleProfileResponse;
import com.example.payment.modules.merchant.dto.UpdateProfileRequest;
import com.example.payment.modules.auth.utils.JwtUtil;
import com.example.payment.modules.merchant.dto.ApiKeysResponse;
import com.example.payment.modules.merchant.dto.ProfileResponse;
import com.example.payment.modules.merchant.dto.RegenerateKeysResponse;
import com.example.payment.modules.merchant.dto.RegisterMerchantRequest;
import com.example.payment.modules.merchant.dto.RegisterMerchantResponse;
import com.example.payment.modules.merchant.dto.UpdateWebhookRequest;
import com.example.payment.modules.merchant.dto.UpdateWebhookResponse;
import com.example.payment.modules.merchant.entity.Merchant;
import com.example.payment.modules.merchant.repository.MerchantRepository;
import com.example.payment.modules.merchant.repository.MerchantWebhookLogRepository;
import com.example.payment.modules.merchant.utils.SecretGeneration;

@Service
public class MerchantService {
    private final MerchantRepository merchantRepository;
    private final MerchantWebhookLogRepository merchantWebhookLogRepository;
    private final SecretGeneration secretGeneration;
    private final JwtUtil jwtUtil;
    private final CryptoUtil cryptoUtil;

    public MerchantService(MerchantRepository merchantRepository,
            MerchantWebhookLogRepository merchantWebhookLogRepository, SecretGeneration secretGeneration,
            JwtUtil jwtUtil, CryptoUtil cryptoUtil) {
        this.merchantRepository = merchantRepository;
        this.merchantWebhookLogRepository = merchantWebhookLogRepository;
        this.secretGeneration = secretGeneration;
        this.jwtUtil = jwtUtil;
        this.cryptoUtil = cryptoUtil;
    }

    private final String aesKeyBase64 = "OIZ0l9yF2p+1AJsbpiN0SYfVt0l7zmUsRjyo0YXJ8Rw=";

    public ProfileResponse getMerchantProfile(String authHeader) {
        try {
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                throw new PaymentException("Missing or invalid Authorization header");
            }

            Long merchantId = jwtUtil.extractMerchantId(authHeader);

            Merchant merchant = merchantRepository.findById(merchantId)
                    .orElseThrow(() -> new PaymentException("Invalid Token"));

            if (merchant == null) {
                throw new PaymentException("Invalid API Key");
            }

            return ProfileResponse.builder()
                    .merchantId(merchant.getId())
                    .businessName(merchant.getBusinessName())
                    .email(merchant.getEmail())
                    .webhookUrl(merchant.getWebhookUrl())
                    .status(merchant.getStatus().name())
                    .build();

        } catch (Exception err) {
            throw new PaymentException(err.getMessage());
        }
    }

    public UpdateWebhookResponse updateWebhookUrl(UpdateWebhookRequest body, String authHeader) {
        try {
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                throw new PaymentException("Missing or invalid Authorization header");
            }

            String secretKey = authHeader.substring(7); // remove "Bearer "

            Merchant merchant = merchantRepository.findBySecretKey(secretKey);
            if (merchant == null) {
                throw new PaymentException("Invalid API Key");
            }

            Merchant webhookUrlAlreadyUsed = merchantRepository.findByWebhookUrl(body.getWebhookUrl());

            if (webhookUrlAlreadyUsed != null) {
                throw new PaymentException("Webhook Url Already Used");
            }

            merchant.setWebhookUrl(body.getWebhookUrl());
            merchant = merchantRepository.save(merchant);

            return UpdateWebhookResponse.builder()
                    .merchantId(merchant.getId())
                    .webhookUrl(body.getWebhookUrl())
                    .message("Webhook Updated Successfully")
                    .build();
        } catch (Exception err) {
            throw new PaymentException(err.getMessage());
        }
    }

    public RegenerateKeysResponse regenerateKeys(String authHeader) {

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new PaymentException("Missing or invalid Authorization header");
        }

        Long merchantId = jwtUtil.extractMerchantId(authHeader);

        Merchant merchant = merchantRepository.findById(merchantId)
                .orElseThrow(() -> new PaymentException("Invalid Token"));

        if (merchant == null) {
            throw new PaymentException("Invalid API Key");
        }

        // Generate new keys
        String newPublicKey = secretGeneration.generatePublicKey();
        String newSecretKey = secretGeneration.generateSecretKey();

        merchant.setPublicKey(newPublicKey);
        merchant.setSecretKey(newSecretKey);

        merchantRepository.save(merchant);

        return RegenerateKeysResponse.builder()
                .merchantId(merchant.getId())
                .publicKey(newPublicKey)
                .secretKey(newSecretKey)
                .build();
    }

    public ToggleProfileResponse disableMerchant(String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new PaymentException("Missing or invalid Authorization header");
        }

        String oldSecretKey = authHeader.substring(7).trim();

        // Validate existing merchant
        Merchant merchant = merchantRepository.findBySecretKey(oldSecretKey);
        if (merchant == null) {
            throw new PaymentException("Invalid API Key");
        }

        merchant.setStatus(MerchantStatus.DISABLED);
        merchant = merchantRepository.save(merchant);

        return ToggleProfileResponse.builder()
                .merchantId(merchant.getId())
                .message("Disabled Successfully")
                .status(MerchantStatus.DISABLED.name())
                .build();
    }

    public ToggleProfileResponse enableMerchant(String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new PaymentException("Missing or invalid Authorization header");
        }

        String oldSecretKey = authHeader.substring(7).trim();

        // Validate existing merchant
        Merchant merchant = merchantRepository.findBySecretKey(oldSecretKey);
        if (merchant == null) {
            throw new PaymentException("Invalid API Key");
        }

        merchant.setStatus(MerchantStatus.ACTIVE);
        merchant = merchantRepository.save(merchant);

        return ToggleProfileResponse.builder()
                .merchantId(merchant.getId())
                .message("Enabled Successfully")
                .status(MerchantStatus.ACTIVE.name())
                .build();
    }

    public ApiKeysResponse getApiKeys(String authHeader) {
        Long merchantId = jwtUtil.extractMerchantId(authHeader);

        Merchant merchant = merchantRepository.findById(merchantId)
                .orElseThrow(() -> new PaymentException("Merchant not found"));

        // Load AES key once
        SecretKey aesKey = cryptoUtil.loadAesKey(aesKeyBase64);

        // Generate IV for this encryption
        byte[] iv = CryptoUtil.generateIv();

        String encryptedPublic;
        String encryptedSecret;

        try {
            encryptedPublic = cryptoUtil.encrypt(merchant.getPublicKey(), aesKey, iv);
            encryptedSecret = cryptoUtil.encrypt(merchant.getSecretKey(), aesKey, iv);
        } catch (Exception e) {
            throw new RuntimeException("Encryption failed", e);
        }

        return ApiKeysResponse.builder()
                .publicKey(encryptedPublic)
                .secretKey(encryptedSecret)
                .iv(Base64.getEncoder().encodeToString(iv))
                .keyVersion("v1") // for future AES rotation
                .build();
    }

    public ProfileResponse updateMerchantProfile(String authHeader, UpdateProfileRequest req) {

        Long merchantId = jwtUtil.extractMerchantId(authHeader);

        Merchant merchant = merchantRepository.findById(merchantId)
                .orElseThrow(() -> new PaymentException("Merchant not found"));

        // --- Update fields ---
        // if (req.getMerchantName() != null) {
        // merchant.setMerchantName(req.getMerchantName());
        // }

        if (req.getBusinessName() != null) {
            merchant.setBusinessName(req.getBusinessName());
        }

        if (req.getEmail() != null) {
            merchant.setEmail(req.getEmail());
        }

        if (req.getWebhookUrl() != null) {
            merchant.setWebhookUrl(req.getWebhookUrl());
        }

        if (req.getStatus() != null) {
            try {
                MerchantStatus newStatus = MerchantStatus.valueOf(req.getStatus().toUpperCase());
                merchant.setStatus(newStatus);
            } catch (IllegalArgumentException e) {
                throw new PaymentException("Invalid status. Allowed: ACTIVE, DISABLED");
            }
        }

        merchantRepository.save(merchant);

        // --- Return updated profile ---
        return ProfileResponse.builder()
                .merchantId(merchant.getId())
                .businessName(merchant.getBusinessName())
                .email(merchant.getEmail())
                .webhookUrl(merchant.getWebhookUrl())
                .status(merchant.getStatus().name())
                .build();
    }

}
