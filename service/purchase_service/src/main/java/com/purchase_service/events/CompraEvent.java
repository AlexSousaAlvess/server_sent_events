package com.purchase_service.events;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CompraEvent {
    private Long productId;
    private String productName;
    private Double price;
    private String buyerEmail;
}
