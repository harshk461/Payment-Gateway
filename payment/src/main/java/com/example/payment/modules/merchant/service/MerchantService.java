package com.example.payment.modules.merchant.service;

import org.springframework.stereotype.Service;

import com.example.payment.core.enums.MerchantStatus;
import com.example.payment.exception.PaymentException;
import com.example.payment.modules.merchant.dto.ToggleProfileResponse;
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

    public MerchantService(MerchantRepository merchantRepository,
            MerchantWebhookLogRepository merchantWebhookLogRepository, SecretGeneration secretGeneration) {
        this.merchantRepository = merchantRepository;
        this.merchantWebhookLogRepository = merchantWebhookLogRepository;
        this.secretGeneration = secretGeneration;
    }

    public RegisterMerchantResponse registerMerchant(RegisterMerchantRequest body) {

        // 1. Check duplicate email
        Merchant emailAlreadyExists = merchantRepository.findByEmail(body.getEmail());
        if (emailAlreadyExists != null) {
            throw new PaymentException("Merchant email already used");
        }

        // 2. Check duplicate webhook URL
        Merchant webhookUrlAlreadyUsed = merchantRepository.findByWebhookUrl(body.getWebhookUrl());
        if (webhookUrlAlreadyUsed != null) {
            throw new PaymentException("Webhook URL already in use");
        }

        // 3. Generate API keys
        String publicKey = secretGeneration.generatePublicKey();
        String secretKey = secretGeneration.generateSecretKey();

        // 4. Save merchant
        Merchant newMerchant = new Merchant();
        newMerchant.setName(body.getName());
        newMerchant.setBusinessName(body.getBusinessName());
        newMerchant.setEmail(body.getEmail());
        newMerchant.setPublicKey(publicKey);
        newMerchant.setSecretKey(secretKey);
        newMerchant.setWebhookUrl(body.getWebhookUrl());
        newMerchant.setStatus(MerchantStatus.ACTIVE);

        newMerchant = merchantRepository.save(newMerchant);

        // 5. Return response (IMPORTANT FIX HERE)
        return RegisterMerchantResponse.builder()
                .merchantId(newMerchant.getId())
                .publicKey(publicKey) // FIXED
                .secretKey(secretKey) // FIXED
                .build();
    }

    public ProfileResponse getMerchantProfile(String authHeader) {
        try {
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                throw new PaymentException("Missing or invalid Authorization header");
            }

            String secretKey = authHeader.substring(7); // remove "Bearer "

            Merchant merchant = merchantRepository.findBySecretKey(secretKey);
            if (merchant == null) {
                throw new PaymentException("Invalid API Key");
            }

            return ProfileResponse.builder()
                    .merchantId(merchant.getId())
                    .businessName(merchant.getBusinessName())
                    .email(merchant.getEmail())
                    .webhookUrl(merchant.getWebhookUrl())
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

        String oldSecretKey = authHeader.substring(7).trim();

        // Validate existing merchant
        Merchant merchant = merchantRepository.findBySecretKey(oldSecretKey);
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
}
