package com.notificacao.dto;

import lombok.Builder;
import lombok.Data;

@Data
public class CompraEvent {
    private Long productId;
    private String productName;
    private Double price;
    private String buyerEmail;
}
