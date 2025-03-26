package com.notificacao.services.impl;

import com.notificacao.dto.NotificationDTO;
import com.notificacao.models.NotificationModel;
import com.notificacao.repositories.NotificationRepository;
import com.notificacao.services.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;

@Slf4j
@RequiredArgsConstructor
@Service
public class NotificationServiceImpl implements NotificationService {
    private final NotificationRepository notificationRepository;

    private final List<SseEmitter> emitters = new CopyOnWriteArrayList<>();

    @Override
    public void save(NotificationDTO dto) {
        log.info("Notificação recebida: {}", dto.getContent());

        NotificationModel n = NotificationModel.builder()
                .type(dto.getType())
                .content(dto.getContent())
                .createdAt(LocalDateTime.now())
                .read(false)
                .build();
        NotificationModel saved = notificationRepository.save(n);
        notifySubscribers(saved);
    }

    @Override
    public List<NotificationModel> listAll() {
        return notificationRepository.findAll();
    }

    @Override
    public List<NotificationModel> listUnread() {
        return notificationRepository.findByReadFalseOrderByCreatedAtAsc();
    }

    @Override
    public void markAsRead(Long id) {
        NotificationModel n = notificationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notificação não encontrada"));
        n.setRead(true);
        notificationRepository.save(n);
    }

    public SseEmitter subscribe() {
        SseEmitter emitter = new SseEmitter(Long.MAX_VALUE);
        emitters.add(emitter);

        emitter.onCompletion(() -> emitters.remove(emitter));
        emitter.onTimeout(() -> emitters.remove(emitter));
        emitter.onError(e -> emitters.remove(emitter));

        return emitter;
    }

    private void notifySubscribers(NotificationModel notification) {
        for (SseEmitter emitter : emitters) {
            try {
                emitter.send(SseEmitter.event()
                        .name("new-notification")
                        .data(notification));
            } catch (IOException e) {
                emitters.remove(emitter);
            }
        }
    }
}
