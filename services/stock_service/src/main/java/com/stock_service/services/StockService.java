package com.stock_service.services;

import com.stock_service.models.StockModel;

public interface StockService {
    StockModel getByProductId(Long productId);

    StockModel updateStock(Long productId, int quantity);
}
