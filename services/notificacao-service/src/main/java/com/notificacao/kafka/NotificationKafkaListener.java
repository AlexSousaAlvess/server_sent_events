package com.notificacao.kafka;

import com.notificacao.dto.CompraEvent;
import com.notificacao.dto.NotificationDTO;
import com.notificacao.services.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Log4j2
@Component
@RequiredArgsConstructor
public class NotificationKafkaListener {
    private final NotificationService notificationService;

    @KafkaListener(
            topics = "notificacoes",
            groupId = "notificacao-group",
            containerFactory = "kafkaListenerCompraEventFactory"
    )
    public void listen(CompraEvent event) {
        log.info("Evento de compra recebido: {}", event);

        // Notificação para OPERADOR
        notificationService.save(new NotificationDTO(
                "OPERADOR",
                String.format("Compra por %s (%s) - Produto: %s, R$ %.2f",
                        event.getBuyerName(), event.getBuyerEmail(), event.getProductName(), event.getPrice()
                ),
                event.getBuyerEmail()
        ));

        // Notificação para SUPERVISOR
        notificationService.save(new NotificationDTO(
                "SUPERVISOR",
                String.format("Produto comprado: %s por R$ %.2f", event.getProductName(), event.getPrice()),
                event.getBuyerEmail()
        ));

        // Notificação para GERENTE
        notificationService.save(new NotificationDTO(
                "GERENTE",
                String.format("Produto: %s, R$ %.2f | Estoque: %s",
                        event.getProductName(),
                        event.getPrice(),
                        event.getStockQuantity() != null ? event.getStockQuantity() : "N/A"),
                event.getBuyerEmail()
        ));
    }
}
