package com.notificacao.repositories;

import com.notificacao.models.NotificationModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<NotificationModel, Long> {

    @Query("SELECT n FROM NotificationModel n WHERE n.type = :userRole ORDER BY n.createdAt ASC")
    List<NotificationModel> listAllByUser(@Param("userRole") String userRole);

    @Query("SELECT n FROM NotificationModel n WHERE n.read = false AND n.type = :userRole ORDER BY n.createdAt ASC")
    List<NotificationModel> findUnreadNotificationsByUser(@Param("userRole") String userRole);


}
