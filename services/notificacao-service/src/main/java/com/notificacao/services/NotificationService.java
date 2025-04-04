package com.notificacao.services;

import com.notificacao.dto.NotificationDTO;
import com.notificacao.models.NotificationModel;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.List;

public interface NotificationService {
    void save(NotificationDTO notificationDTO);

    List<NotificationModel> listAll(String userRole);

    void markAsRead(Long id);

    SseEmitter subscribe();

    List<NotificationModel> listUnreadForUser(String userRole);
}
