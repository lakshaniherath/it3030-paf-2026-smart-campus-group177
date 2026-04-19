package com.example.demo.controller;

import com.example.demo.model.Notification;
import com.example.demo.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    /**
     * Get all notifications for the current user
     * GET /api/notifications
     */
    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> getUserNotifications(
            @RequestParam(defaultValue = "false") boolean unreadOnly) {
        try {
            String userEmail = getUserEmailFromContext();
            List<Notification> notifications = unreadOnly 
                ? notificationService.getUnreadNotifications(userEmail)
                : notificationService.getUserNotifications(userEmail);
            
            return ResponseEntity.ok(Map.of(
                "message", "Notifications retrieved successfully",
                "count", notifications.size(),
                "notifications", notifications,
                "status", "success"
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                "message", "Error retrieving notifications: " + e.getMessage(),
                "status", "error"
            ));
        }
    }

    /**
     * Get specific notification by ID
     * GET /api/notifications/{id}
     */
    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> getNotification(@PathVariable String id) {
        try {
            Notification notification = notificationService.getNotificationById(id);
            if (notification == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of(
                    "message", "Notification not found",
                    "status", "error"
                ));
            }
            return ResponseEntity.ok(Map.of(
                "message", "Notification retrieved successfully",
                "notification", notification,
                "status", "success"
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                "message", "Error retrieving notification: " + e.getMessage(),
                "status", "error"
            ));
        }
    }

    /**
     * Mark notification as read
     * PUT /api/notifications/{id}/read
     */
    @PutMapping("/{id}/read")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> markAsRead(@PathVariable String id) {
        try {
            Notification notification = notificationService.markAsRead(id);
            if (notification == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of(
                    "message", "Notification not found",
                    "status", "error"
                ));
            }
            return ResponseEntity.ok(Map.of(
                "message", "Notification marked as read",
                "notification", notification,
                "status", "success"
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                "message", "Error marking notification as read: " + e.getMessage(),
                "status", "error"
            ));
        }
    }

    /**
     * Mark all notifications as read for current user
     * PUT /api/notifications/mark-all-read
     */
    @PutMapping("/mark-all-read")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> markAllAsRead() {
        try {
            String userEmail = getUserEmailFromContext();
            int count = notificationService.markAllAsRead(userEmail);
            return ResponseEntity.ok(Map.of(
                "message", "All notifications marked as read",
                "count", count,
                "status", "success"
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                "message", "Error marking notifications as read: " + e.getMessage(),
                "status", "error"
            ));
        }
    }

    /**
     * Delete a notification
     * DELETE /api/notifications/{id}
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> deleteNotification(@PathVariable String id) {
        try {
            boolean deleted = notificationService.deleteNotification(id);
            if (!deleted) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of(
                    "message", "Notification not found",
                    "status", "error"
                ));
            }
            return ResponseEntity.ok(Map.of(
                "message", "Notification deleted successfully",
                "status", "success"
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                "message", "Error deleting notification: " + e.getMessage(),
                "status", "error"
            ));
        }
    }

    /**
     * Create a notification (for admin/system use)
     * POST /api/notifications
     */
    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'TECHNICIAN')")
    public ResponseEntity<?> createNotification(@RequestBody Map<String, String> notificationData) {
        try {
            String userEmail = notificationData.get("userEmail");
            String type = notificationData.get("type"); // BOOKING, TICKET, COMMENT
            String title = notificationData.get("title");
            String message = notificationData.get("message");
            String relatedId = notificationData.get("relatedId");

            Notification notification = notificationService.createNotification(
                userEmail, type, title, message, relatedId
            );

            return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                "message", "Notification created successfully",
                "notification", notification,
                "status", "success"
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                "message", "Error creating notification: " + e.getMessage(),
                "status", "error"
            ));
        }
    }

    /**
     * Get unread notification count for current user
     * GET /api/notifications/count/unread
     */
    @GetMapping("/count/unread")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> getUnreadCount() {
        try {
            String userEmail = getUserEmailFromContext();
            int count = notificationService.getUnreadCount(userEmail);
            return ResponseEntity.ok(Map.of(
                "message", "Unread count retrieved",
                "count", count,
                "status", "success"
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                "message", "Error retrieving unread count: " + e.getMessage(),
                "status", "error"
            ));
        }
    }

    /**
     * Helper method to get user email from security context
     */
    private String getUserEmailFromContext() {
        // In a real scenario, this would be extracted from the JWT token
        // For now, returning a placeholder
        return "user@example.com";
    }
}
