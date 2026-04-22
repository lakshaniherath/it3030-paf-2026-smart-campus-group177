package com.example.demo.service;

<<<<<<< HEAD
import com.example.demo.model.Notification;
import com.example.demo.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    /**
     * Send notification to user (for booking approvals/rejections)
     */
    public Notification sendNotification(String userEmail, String type, String title, String message) {
        Notification notification = new Notification();
        notification.setUserEmail(userEmail);
        notification.setType(type);
        notification.setTitle(title);
        notification.setMessage(message);
        notification.setRead(false);
        notification.setCreatedAt(LocalDateTime.now());
        return notificationRepository.save(notification);
    }

    /**
     * Create notification with related ID (for booking/ticket tracking)
     */
    public Notification createNotification(String userEmail, String type, String title, String message, String relatedId) {
        Notification notification = new Notification();
        notification.setUserEmail(userEmail);
        notification.setType(type); // BOOKING, TICKET, COMMENT
        notification.setTitle(title);
        notification.setMessage(message);
        notification.setRelatedId(relatedId);
        notification.setRead(false);
        notification.setCreatedAt(LocalDateTime.now());
        return notificationRepository.save(notification);
    }

    /**
     * Get all notifications for a user
     */
    public List<Notification> getUserNotifications(String userEmail) {
        return notificationRepository.findByUserEmail(userEmail);
    }

    /**
     * Get unread notifications for a user
     */
    public List<Notification> getUnreadNotifications(String userEmail) {
        return notificationRepository.findByUserEmailAndRead(userEmail, false);
    }

    /**
     * Get notification by ID
     */
    public Notification getNotificationById(String id) {
        Optional<Notification> notification = notificationRepository.findById(id);
        return notification.orElse(null);
    }

    /**
     * Mark notification as read
     */
    public Notification markAsRead(String id) {
        Optional<Notification> notification = notificationRepository.findById(id);
        if (notification.isPresent()) {
            Notification notif = notification.get();
            notif.setRead(true);
            return notificationRepository.save(notif);
        }
        return null;
    }

    /**
     * Mark all notifications as read for user
     */
    public int markAllAsRead(String userEmail) {
        List<Notification> unreadNotifications = notificationRepository.findByUserEmailAndRead(userEmail, false);
        for (Notification notification : unreadNotifications) {
            notification.setRead(true);
            notificationRepository.save(notification);
        }
        return unreadNotifications.size();
    }

    /**
     * Delete notification
     */
    public boolean deleteNotification(String id) {
        if (notificationRepository.existsById(id)) {
            notificationRepository.deleteById(id);
            return true;
        }
        return false;
    }

    /**
     * Get count of unread notifications
     */
    public int getUnreadCount(String userEmail) {
        return (int) notificationRepository.findByUserEmailAndRead(userEmail, false).size();
    }

    /**
     * Get notifications by type
     */
    public List<Notification> getNotificationsByType(String userEmail, String type) {
        return notificationRepository.findByUserEmailAndType(userEmail, type);
    }

    /**
     * Legacy method - for backward compatibility
     */
    public List<Notification> getNotificationsByUser(String userEmail) {
        return notificationRepository.findByUserEmail(userEmail);
    }

    /**
     * Send booking status notification
     */
    public Notification sendBookingNotification(String userEmail, String status, String resourceName, String bookingId) {
        String title = "Booking " + status;
        String message = "Your booking for " + resourceName + " has been " + status.toLowerCase();
        return createNotification(userEmail, "BOOKING", title, message, bookingId);
    }

    /**
     * Send ticket status notification
     */
    public Notification sendTicketNotification(String userEmail, String status, String ticketDescription, String ticketId) {
        String title = "Ticket Status: " + status;
        String message = "Your ticket \"" + ticketDescription + "\" status has been updated to " + status;
        return createNotification(userEmail, "TICKET", title, message, ticketId);
    }

    /**
     * Send comment notification
     */
    public Notification sendCommentNotification(String userEmail, String commenterName, String ticketId) {
        String title = "New Comment";
        String message = commenterName + " added a comment to your ticket";
        return createNotification(userEmail, "COMMENT", title, message, ticketId);
    }
}

=======
public class NotificationService {
    
}
>>>>>>> member-01
