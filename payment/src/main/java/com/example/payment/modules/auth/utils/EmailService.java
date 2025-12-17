package com.example.payment.modules.auth.utils;

import org.springframework.stereotype.Service;

@Service
public class EmailService {
    public void sendResetPassword(String toEmail, String resetLink) {
        // TODO: Replace with real mail sender (JavaMailSender or external provider)
        System.out.println("SEND EMAIL to " + toEmail + " resetLink=" + resetLink);
    }
}
