package com.stock_service.events;

import lombok.Data;

@Data
public class CompraEvent {
    private Long productId;
    private String productName;
    private Double price;
    private String buyerEmail;
}