package com.notificacao.services;

import com.notificacao.models.NotificationModel;

import java.util.List;

public interface NotificationService {
    void save(String type, String content);

    List<NotificationModel> listAll();

    List<NotificationModel> listUnread();

    void markAsRead(Long id);
}
