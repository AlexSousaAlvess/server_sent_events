package com.example.demo.services.impl;

import com.example.demo.dto.NotificationDTO;
import com.example.demo.kafka.NotificationProducer;
import com.example.demo.services.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {

    private final NotificationProducer producer;

    @Override
    public void sendNotification(String type, String content) {
        NotificationDTO dto = new NotificationDTO(type, content);
        producer.sendNotification(dto);
    }
}