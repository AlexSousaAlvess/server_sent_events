package com.example.demo.controllers;

import com.example.demo.models.NotificationModel;
import com.example.demo.services.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/notifications")
@RequiredArgsConstructor
public class NotificationController {
    private final NotificationService notificationService;

    @GetMapping
    public List<NotificationModel> getAllNotifications() {
        return notificationService.listAll();
    }

    @GetMapping("/unread")
    public List<NotificationModel> getUnreadNotifications() {
        return notificationService.listUnread();
    }

    @PatchMapping("/{id}/read")
    public ResponseEntity<?> markAsRead(@PathVariable Long id) {
        notificationService.markAsRead(id);
        return ResponseEntity.ok().build();
    }
}
