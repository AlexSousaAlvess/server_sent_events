package com.example.demo.repositories;

import com.example.demo.models.NotificationModel;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotificationRepository extends JpaRepository<NotificationModel, Long> {
    List<NotificationModel> findByReadFalseOrderByCreatedAtAsc();
}
