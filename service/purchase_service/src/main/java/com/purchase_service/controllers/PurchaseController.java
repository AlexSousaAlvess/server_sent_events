package com.purchase_service.controllers;

import com.purchase_service.dto.PurchaseRequest;
import com.purchase_service.services.PurchaseService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequiredArgsConstructor
@RestController
@RequestMapping("/purchases")
public class PurchaseController {
    private final PurchaseService purchaseService;

    @PostMapping
    public ResponseEntity<Object> create(@RequestBody PurchaseRequest request) {
        purchaseService.processPurchase(request);
        return ResponseEntity.status(HttpStatus.OK).body("Compra registrada com sucesso");
    }
}
