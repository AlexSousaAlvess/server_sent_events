package com.purchase_service.dto;

import lombok.Data;

@Data
public class PurchaseRequest {
    private Long productId;
    private String buyerEmail;
}
