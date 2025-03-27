package com.stock_service.repositories;

import com.stock_service.models.StockModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface StockRepository extends JpaRepository<StockModel, Long> {
    Optional<StockModel> findByProductId(Long productId);
}
