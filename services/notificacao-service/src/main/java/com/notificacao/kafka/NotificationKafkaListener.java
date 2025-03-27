package com.notificacao.kafka;

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
            containerFactory = "kafkaListenerContainerFactory"
    )
    public void listen(NotificationDTO dto) {
        log.info("Kafka - Notificação recebida: {}", dto.getContent());
        notificationService.save(dto);
    }
}
