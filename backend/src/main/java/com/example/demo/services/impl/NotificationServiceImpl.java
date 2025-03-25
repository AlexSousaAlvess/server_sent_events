package com.example.demo.services.impl;

import com.example.demo.dto.NotificationDTO;
import com.example.demo.services.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {

    private final RestTemplate restTemplate;

    @Value("${notification.service.url}")
    private String notificationServiceUrl;


    @Override
    public void sendNotification(String type, String content) {
        NotificationDTO dto = new NotificationDTO(type, content);
        restTemplate.postForEntity(notificationServiceUrl + "/notifications", dto, Void.class);
    }
}