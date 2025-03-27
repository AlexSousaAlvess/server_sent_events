package com.stock_service.services.impl;

import com.stock_service.models.StockModel;
import com.stock_service.repositories.StockRepository;
import com.stock_service.services.StockService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class StockServiceImpl implements StockService {

    private final StockRepository stockRepository;

    @Override
    public StockModel getByProductId(Long productId) {
        return stockRepository.findByProductId(productId)
                .orElseThrow(() -> new RuntimeException("Estoque não encontrado para o produto ID: " + productId));
    }

    @Override
    public StockModel updateStock(Long productId, int quantity) {
        StockModel stock = stockRepository.findByProductId(productId)
                .orElseThrow(() -> new RuntimeException("Estoque não encontrado para o produto ID: " + productId));
        stock.setQuantity(quantity);
        return stockRepository.save(stock);
    }
}
