package com.stock_service.controllers;

import com.stock_service.models.StockModel;
import com.stock_service.services.StockService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/stock")
@RequiredArgsConstructor
public class StockController {

    private final StockService stockService;

    @GetMapping("/{productId}")
    public ResponseEntity<StockModel> getStockByProductId(@PathVariable Long productId) {
        return ResponseEntity.ok(stockService.getByProductId(productId));
    }

    @PutMapping("/{productId}")
    public ResponseEntity<StockModel> updateStock(
            @PathVariable Long productId,
            @RequestParam int quantity
    ) {
        return ResponseEntity.ok(stockService.updateStock(productId, quantity));
    }
}