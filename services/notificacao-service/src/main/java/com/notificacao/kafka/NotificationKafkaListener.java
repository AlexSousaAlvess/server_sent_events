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
        if (event == null || event.getProductName() == null || event.getPrice() == null) {
            log.error("Evento inválido: {}", event);
            return;
        }

        log.info("Kafka - Evento de compra recebido: {}", event);

        String content = String.format("Compra realizada: Produto %s por R$%.2f",
                event.getProductName(),
                event.getPrice());

        NotificationDTO dto = new NotificationDTO("COMPRA", content);
        notificationService.save(dto);
    }


}
