package com.purchase_service.services;

import com.purchase_service.dto.PurchaseRequest;

public interface PurchaseService {
    void processPurchase(PurchaseRequest request, String userEmail, String userRole);
}
