package com.purchase_service.controllers;

import com.purchase_service.dto.PurchaseRequest;
import com.purchase_service.services.PurchaseService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RequiredArgsConstructor
@RestController
@RequestMapping("/purchases")
public class PurchaseController {
    private final PurchaseService purchaseService;

    @PostMapping
    public ResponseEntity<Object> create(
            @RequestBody PurchaseRequest request,
            @RequestHeader("x-user-email") String userEmail,
            @RequestHeader("x-user-role") String userRole,
            @RequestHeader("Authorization") String token
    ) {
        purchaseService.processPurchase(request, userEmail, userRole, token);
        return ResponseEntity.status(HttpStatus.OK).body("Compra registrada com sucesso");
    }
}
