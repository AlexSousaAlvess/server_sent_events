package com.purchase_service.events;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CompraEvent {
    private Long productId;
    private String productName;
    private Double price;
    private String buyerEmail;
    private String buyerName;
    private Integer stockQuantity; // será preenchido posteriormente
}
