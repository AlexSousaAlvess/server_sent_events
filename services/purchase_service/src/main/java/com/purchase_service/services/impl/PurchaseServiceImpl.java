package com.purchase_service.services.impl;

import com.purchase_service.dto.PurchaseRequest;
import com.purchase_service.events.CompraEvent;
import com.purchase_service.models.PurchaseModel;
import com.purchase_service.repositories.PurchaseRepository;
import com.purchase_service.services.PurchaseService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.time.LocalDateTime;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class PurchaseServiceImpl implements PurchaseService {

    private final PurchaseRepository purchaseRepository;
    private final KafkaTemplate<String, CompraEvent> kafkaTemplate;

    private final RestTemplate restTemplate = new RestTemplate();

    @Override
    public void processPurchase(PurchaseRequest request, String userEmail, String userRole) {
        log.info("Usuario logado: {}", userEmail);
        log.info("Perfil: {}",userRole);

        // Buscar produto no product-service
        Map product = restTemplate.getForObject(
                "http://localhost:8090/product/" + request.getProductId(), Map.class);

        if(userRole.equals("GERENTE")){
            //
        }

        if (product == null) {
            throw new RuntimeException("Produto não encontrado");
        }

        // Criar modelo de compra
        PurchaseModel purchase = PurchaseModel.builder()
                .productId(request.getProductId())
                .productName((String) product.get("name"))
                .price(Double.valueOf(product.get("price").toString()))
                .buyerEmail(request.getBuyerEmail())
                .purchasedAt(LocalDateTime.now())
                .build();

        purchaseRepository.save(purchase);

        // Publicar evento Kafka
        CompraEvent event = CompraEvent.builder()
                .productId(purchase.getProductId())
                .productName(purchase.getProductName())
                .price(purchase.getPrice())
                .buyerEmail(purchase.getBuyerEmail())
                .build();

        kafkaTemplate.send("compra-realizada", event);
        log.info("Compra realizada: {}", event);
    }
}
