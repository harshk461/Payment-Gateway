package com.example.payment.modules.payment.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class PaymentMethodDto {

    private String methodType; // CARD / UPI / DUMMY
    private String token; // masked or dummy
    private String maskedDetails;
}
