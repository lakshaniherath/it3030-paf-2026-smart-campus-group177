package com.example.demo.repository;

import com.example.demo.model.Notification;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface NotificationRepository extends MongoRepository<Notification, String> {
    List<Notification> findByRecipientEmail(String email);
    List<Notification> findByUserEmail(String userEmail);
    List<Notification> findByUserEmailAndRead(String userEmail, boolean read);
    List<Notification> findByUserEmailAndType(String userEmail, String type);
    List<Notification> findByRelatedId(String relatedId);
}