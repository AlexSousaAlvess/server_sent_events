package com.example.demo.kafka;

import com.example.demo.dto.NotificationDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class NotificationProducer {
    private final KafkaTemplate<String, NotificationDTO> kafkaTemplate;

    public void sendNotification(NotificationDTO notificationDTO) {
        kafkaTemplate.send("notificacoes", notificationDTO);
    }
}
