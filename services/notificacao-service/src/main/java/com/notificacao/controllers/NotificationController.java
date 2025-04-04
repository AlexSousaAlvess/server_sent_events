package com.notificacao.controllers;

import com.notificacao.dto.NotificationDTO;
import com.notificacao.models.NotificationModel;
import com.notificacao.services.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor
@RestController
@RequestMapping("/notifications")
public class NotificationController {

    private final NotificationService notificationService;

    @PostMapping
    public ResponseEntity<Void> create(@RequestBody NotificationDTO dto) {

        notificationService.save(dto);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/unread")
    public List<NotificationModel> getUnread(@RequestHeader("x-user-role") String userRole) {
        var notification = notificationService.listUnreadForUser(userRole);
        return notification;
    }

    @GetMapping("/list")
    public List<NotificationModel> getList(@RequestHeader("x-user-role") String userRole) {
        var notification = notificationService.listAll(userRole);
        return notification;
    }

    @PatchMapping("/{id}/read")
    public ResponseEntity<Void> markAsRead(@PathVariable Long id) {
        notificationService.markAsRead(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping(value = "/subscribe", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter subscribe() {
        return notificationService.subscribe();
    }
}
