package com.example.demo.services;

import com.example.demo.models.NotificationModel;

import java.util.List;

public interface NotificationService {
    void save(String type, String content);

    List<NotificationModel> listAll();

    List<NotificationModel> listUnread();

    void markAsRead(Long id);
}
