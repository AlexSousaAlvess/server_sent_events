package com.notificacao.services.impl;

import com.notificacao.models.NotificationModel;
import com.notificacao.repositories.NotificationRepository;
import com.notificacao.services.NotificationService;
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

    public List<NotificationModel> listUnread() {
        return notificationRepository.findByReadFalseOrderByCreatedAtAsc();
    }

    public void markAsRead(Long id) {
        NotificationModel notification = notificationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notificação não encontrada"));
        notification.setRead(true);
        notificationRepository.save(notification);
    }
}
