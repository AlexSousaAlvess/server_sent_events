package com.stock_service.kafka;

import com.stock_service.events.CompraEvent;
import com.stock_service.repositories.StockRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class CompraEventConsumer {

    private final StockRepository stockRepository;

    @KafkaListener(topics = "notificacoes", groupId = "stock-service")
    public void consumeCompraEvent(CompraEvent event) {
        log.info("Evento de compra recebido: {}", event);

        stockRepository.findByProductId(event.getProductId())
                .ifPresentOrElse(stock -> {
                    int novaQuantidade = stock.getQuantity() - 1;
                    stock.setQuantity(Math.max(novaQuantidade, 0));
                    stockRepository.save(stock);
                    log.info("Estoque atualizado para produto {}: {}", event.getProductId(), stock.getQuantity());
                }, () -> {
                    log.warn("Estoque não encontrado para o produto {}", event.getProductId());
                });
    }
}
