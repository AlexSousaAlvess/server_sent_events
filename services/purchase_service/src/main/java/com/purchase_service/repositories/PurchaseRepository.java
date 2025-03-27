package com.purchase_service.repositories;

import com.purchase_service.models.PurchaseModel;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PurchaseRepository extends JpaRepository<PurchaseModel, Long> {
}
