package com.example.payment.modules.dashboard.service;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.payment.core.enums.MerchantStatus;
import com.example.payment.exception.PaymentException;
import com.example.payment.modules.auth.entity.DashboardMerchant;
import com.example.payment.modules.auth.repository.DashboardMerchantRepository;
import com.example.payment.modules.auth.utils.JwtUtil;
import com.example.payment.modules.dashboard.controller.AdminController;
import com.example.payment.modules.dashboard.controller.AdminRegenerateKeysResponse;
import com.example.payment.modules.dashboard.dto.AllMerchants;
import com.example.payment.modules.dashboard.dto.MerchantDetailsResponse;
import com.example.payment.modules.dashboard.dto.MerchantRow;
import com.example.payment.modules.dashboard.dto.ShadowModeTokenResponse;
import com.example.payment.modules.dashboard.dto.UpdateWebhookRequest;
import com.example.payment.modules.dashboard.utils.AdminAuthUtil;
import com.example.payment.modules.dashboard.utils.PasswordGenerator;
import com.example.payment.modules.merchant.dto.RegisterMerchantRequest;
import com.example.payment.modules.merchant.dto.RegisterMerchantResponse;
import com.example.payment.modules.merchant.entity.Merchant;
import com.example.payment.modules.merchant.entity.MerchantDocument;
import com.example.payment.modules.merchant.repository.MerchantDocumentRepository;
import com.example.payment.modules.merchant.repository.MerchantRepository;
import com.example.payment.modules.merchant.utils.SecretGeneration;
import com.example.payment.modules.payment.repository.PaymentTransactionRepository;
import com.example.payment.modules.payment.repository.WebhookEventRepository;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.transaction.Transactional;

@Service
@Transactional
public class AdminService {

    private final DashboardMerchantRepository dashboardMerchantRepository;

    private final MerchantRepository merchantRepository;
    private final PaymentTransactionRepository txnRepo;
    private final MerchantDocumentRepository docRepo;
    private final WebhookEventRepository webhookRepo;
    private final SecretGeneration secretGeneration;
    private final AdminAuthUtil adminAuthUtil;
    private final PasswordGenerator passwordGenerator;
    private final JwtUtil jwtUtil;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public AdminService(MerchantRepository merchantRepository,
            PaymentTransactionRepository txnRepo,
            WebhookEventRepository webhookRepo,
            SecretGeneration secretGeneration,
            AdminAuthUtil adminAuthUtil, PasswordGenerator passwordGenerator,
            DashboardMerchantRepository dashboardMerchantRepository, MerchantDocumentRepository docRepo,
            JwtUtil jwtUtil) {
        this.merchantRepository = merchantRepository;
        this.txnRepo = txnRepo;
        this.webhookRepo = webhookRepo;
        this.secretGeneration = secretGeneration;
        this.adminAuthUtil = adminAuthUtil;
        this.passwordGenerator = passwordGenerator;
        this.dashboardMerchantRepository = dashboardMerchantRepository;
        this.docRepo = docRepo;
        this.jwtUtil = jwtUtil;
    }

    public AllMerchants listMerchants(String authHeader, int page, int size, String status, String search) {
        adminAuthUtil.requireAdmin(authHeader);

        if (page < 1)
            page = 1;
        if (size < 1)
            size = 10;
        String normalizedStatus = (status == null || status.isBlank()) ? "all" : status;
        String normalizedSearch = (search == null) ? "" : search.trim();

        int offset = (page - 1) * size;
        List<Merchant> rows = merchantRepository.searchMerchants(normalizedStatus, normalizedSearch, size, offset);
        Long total = merchantRepository.countSearchMerchants(normalizedStatus, normalizedSearch);

        List<MerchantRow> data = rows.stream().map(m -> {
            Long volume = txnRepo.getTotalVolumeByMerchant(m.getId());
            Long webhookFailures = webhookRepo.countWebhookFailures(m.getId());
            Long apiErrors = txnRepo.countTotalFailed(m.getId()); // using failed as API errors approximate
            return MerchantRow.builder()
                    .id(m.getId())
                    .name(m.getName())
                    .businessName(m.getBusinessName())
                    .email(m.getEmail())
                    .status(m.getStatus() != null ? m.getStatus().name() : "UNKNOWN")
                    .volume(volume != null ? volume : 0L)
                    .apiErrors(apiErrors != null ? apiErrors : 0L)
                    .webhookFailures(webhookFailures != null ? webhookFailures : 0L)
                    .build();
        }).collect(Collectors.toList());

        return AllMerchants.builder()
                .page(page)
                .size(size)
                .total(total != null ? total : 0L)
                .merchants(data)
                .build();
    }

    public MerchantRow getMerchant(String authHeader, Long id) {
        adminAuthUtil.requireAdmin(authHeader);

        Merchant m = merchantRepository.findById(id)
                .orElseThrow(() -> new PaymentException("Merchant not found"));

        Long volume = txnRepo.getTotalVolumeByMerchant(m.getId());
        Long webhookFailures = webhookRepo.countWebhookFailures(m.getId());
        Long apiErrors = txnRepo.countTotalFailed(m.getId());

        DateTimeFormatter fmt = DateTimeFormatter.ISO_OFFSET_DATE_TIME;

        return MerchantRow.builder()
                .id(m.getId())
                .name(m.getName())
                .businessName(m.getBusinessName())
                .email(m.getEmail())
                .webhookUrl(m.getWebhookUrl())
                .status(m.getStatus() != null ? m.getStatus().name() : "UNKNOWN")
                .volume(volume != null ? volume : 0L)
                .apiErrors(apiErrors != null ? apiErrors : 0L)
                .webhookFailures(webhookFailures != null ? webhookFailures : 0L)
                .build();
    }

    public RegisterMerchantResponse registerMerchant(RegisterMerchantRequest body, String ip, String ua) {

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

        String temporaryPassword = passwordGenerator.generate(8);

        // make dashboard user
        DashboardMerchant dashboardMerchant = new DashboardMerchant();
        dashboardMerchant.setMerchantId(newMerchant.getId());
        dashboardMerchant.setEmail(body.getEmail());
        dashboardMerchant.setEnabled(true);
        dashboardMerchant.setPasswordHash(passwordEncoder.encode(temporaryPassword));
        dashboardMerchant.setLastLoginIp(ip);
        dashboardMerchant.setLastLoginUserAgent(ua);
        dashboardMerchant = dashboardMerchantRepository.save(dashboardMerchant);
        // 5. Return response (IMPORTANT FIX HERE)
        return RegisterMerchantResponse.builder()
                .merchantId(newMerchant.getId())
                .publicKey(publicKey) // FIXED
                .secretKey(secretKey) // FIXED
                .email(body.getEmail())
                .password(temporaryPassword)
                .build();
    }

    public MerchantDetailsResponse getMerchantDetails(Long merchantId) {
        Merchant m = merchantRepository.findById(merchantId)
                .orElseThrow(() -> new RuntimeException("Merchant not found"));

        List<MerchantDocument> documents = docRepo.findByMerchantId(merchantId);

        List<MerchantDetailsResponse.DocumentInfo> docs = documents.stream()
                .map(d -> MerchantDetailsResponse.DocumentInfo.builder()
                        .name(d.getName())
                        .status(d.getStatus().name())
                        .build())
                .toList();

        return MerchantDetailsResponse.builder()
                .id(m.getId())
                .name(m.getName())
                .businessName(m.getBusinessName())
                .email(m.getEmail())
                .webhookUrl(m.getWebhookUrl())
                .status(m.getStatus().name())
                .riskScore(generateRiskScore(merchantId))
                .publicKey(m.getPublicKey())
                .secretKeyMasked(maskSecretKey(m.getSecretKey()))
                .secretKey(m.getSecretKey())
                .documents(docs)
                .build();
    }

    public void suspendMerchant(Long merchantId) {
        Merchant m = find(merchantId);
        m.setStatus(MerchantStatus.DISABLED);
        merchantRepository.save(m);
    }

    public void activateMerchant(Long merchantId) {
        Merchant m = find(merchantId);
        m.setStatus(MerchantStatus.ACTIVE);
        merchantRepository.save(m);
    }

    public AdminRegenerateKeysResponse regenerateApiKeys(Long merchantId) {
        Merchant m = find(merchantId);

        String newPublic = "pk_live_" + randomString();
        String newSecret = "sk_live_" + randomString();

        m.setPublicKey(newPublic);
        m.setSecretKey(newSecret);

        merchantRepository.save(m);

        return AdminRegenerateKeysResponse.builder()
                .publicKey(newPublic)
                .secretKey(newSecret)
                .build();
    }

    public void updateWebhook(Long merchantId, UpdateWebhookRequest req) {
        Merchant m = find(merchantId);
        m.setWebhookUrl(req.getWebhookUrl());
        merchantRepository.save(m);
    }

    public ShadowModeTokenResponse generateShadowModeToken(Long merchantId) {
        String token = jwtUtil.generateShadowModeToken(merchantId);

        return ShadowModeTokenResponse.builder()
                .shadowJwt(token)
                .merchantId(merchantId)
                .build();
    }

    private Merchant find(Long id) {
        return merchantRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Merchant not found"));
    }

    private int generateRiskScore(Long id) {
        return (int) (Math.random() * 100);
    }

    private String randomString() {
        return Long.toHexString(Double.doubleToLongBits(Math.random()));
    }

    private String maskSecretKey(String key) {
        if (key == null || key.length() < 8)
            return "********";
        return key.substring(0, 8) + "•".repeat(12);
    }
}