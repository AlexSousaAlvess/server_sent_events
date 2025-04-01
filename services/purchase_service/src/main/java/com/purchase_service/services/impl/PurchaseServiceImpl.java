package com.purchase_service.services.impl;

import com.purchase_service.dto.PurchaseRequest;
import com.purchase_service.events.CompraEvent;
import com.purchase_service.models.PurchaseModel;
import com.purchase_service.repositories.PurchaseRepository;
import com.purchase_service.services.PurchaseService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.time.LocalDateTime;
import java.util.Map;

@Slf4j
@RequiredArgsConstructor
@Service
public class PurchaseServiceImpl implements PurchaseService {

    private final PurchaseRepository purchaseRepository;
    private final KafkaTemplate<String, CompraEvent> kafkaTemplate;

    private final RestTemplate restTemplate = new RestTemplate();

    @Override
    public void processPurchase(PurchaseRequest request, String userEmail, String userRole, String token) {
        log.info("Usuario logado: {}", userEmail);
        log.info("Perfil: {}", userRole);

        // Criar uma nova instância do RestTemplate com headers
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", token);
        HttpEntity<Void> entity = new HttpEntity<>(headers);

        ResponseEntity<Map> response = restTemplate.exchange(
                "http://localhost:8080/product/" + request.getProductId(),
                HttpMethod.GET,
                entity,
                Map.class
        );

        Map product = response.getBody();

        if (product == null) {
            throw new RuntimeException("Produto não encontrado");
        }

        // Criação e salvamento continuam iguais...
        PurchaseModel purchase = PurchaseModel.builder()
                .productId(request.getProductId())
                .productName((String) product.get("name"))
                .price(Double.valueOf(product.get("price").toString()))
                .buyerEmail(request.getBuyerEmail())
                .purchasedAt(LocalDateTime.now())
                .build();

        purchaseRepository.save(purchase);

        CompraEvent event = CompraEvent.builder()
                .productId(purchase.getProductId())
                .productName(purchase.getProductName())
                .price(purchase.getPrice())
                .buyerEmail(purchase.getBuyerEmail())
                .build();

        kafkaTemplate.send("notificacoes", event);
        log.info("Compra realizada: {}", event);
    }
}
