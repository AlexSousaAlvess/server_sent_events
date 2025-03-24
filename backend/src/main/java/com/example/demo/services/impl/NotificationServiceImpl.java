package com.example.demo.services.impl;

import com.example.demo.models.NotificationModel;
import com.example.demo.repositories.NotificationRepository;
import com.example.demo.services.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@RequiredArgsConstructor
@Service
public class NotificationServiceImpl implements NotificationService {
    private final NotificationRepository notificationRepository;


    @Override
    public void save(String type, String content) {
        NotificationModel notification = NotificationModel.builder()
                .type(type)
                .content(content)
                .createdAt(LocalDateTime.now())
                .build();
        notificationRepository.save(notification);
    }

    @Override
    public List<NotificationModel> listAll() {
        return notificationRepository.findAll();
    }
}
