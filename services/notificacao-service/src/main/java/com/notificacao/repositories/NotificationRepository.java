package com.notificacao.repositories;

import com.notificacao.models.NotificationModel;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotificationRepository extends JpaRepository<NotificationModel, Long> {
    List<NotificationModel> findByReadFalseOrderByCreatedAtAsc();
}
