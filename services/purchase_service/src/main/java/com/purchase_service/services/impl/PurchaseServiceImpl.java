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

        // Buscar dados do produto
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

        // Consultar nome do comprador (auth-service)
        String buyerName = "";
        try {
            ResponseEntity<Map> profileResponse = restTemplate.exchange(
                    "http://localhost:8080/auth/profile?email=" + request.getBuyerEmail(),
                    HttpMethod.GET,
                    entity,
                    Map.class
            );

            Map profile = profileResponse.getBody();
            buyerName = (String) profile.getOrDefault("name", "");
            log.info("Nome do comprador obtido do auth-service: {}", buyerName);

        } catch (Exception e) {
            log.warn("Erro ao consultar nome do comprador no auth-service: {}", e.getMessage());
        }

        // Criar e salvar a compra
        PurchaseModel purchase = PurchaseModel.builder()
                .productId(request.getProductId())
                .productName((String) product.get("name"))
                .price(Double.valueOf(product.get("price").toString()))
                .buyerEmail(request.getBuyerEmail())
                .purchasedAt(LocalDateTime.now())
                .build();

        purchaseRepository.save(purchase);

        // Montar e enviar o novo CompraEvent
        CompraEvent event = CompraEvent.builder()
                .productId(purchase.getProductId())
                .productName(purchase.getProductName())
                .price(purchase.getPrice())
                .buyerEmail(purchase.getBuyerEmail())
                .buyerName(buyerName)
                .stockQuantity(null)
                .build();

        kafkaTemplate.send("notificacoes", event);
        log.info("Compra realizada: {}", event);
    }
}
