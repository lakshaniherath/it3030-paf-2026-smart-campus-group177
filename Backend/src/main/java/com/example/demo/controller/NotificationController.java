package com.example.demo.controller;

import com.example.demo.model.Notification;
import com.example.demo.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;
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
            @RequestParam(defaultValue = "false") boolean unreadOnly,
            Authentication authentication,
            HttpServletRequest request) {
        try {
            String userEmail = getUserEmailFromContext(authentication, request);
            if (userEmail == null || userEmail.isBlank()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of(
                    "message", "Unable to determine current user",
                    "status", "error"
                ));
            }
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
    public ResponseEntity<?> markAllAsRead(Authentication authentication, HttpServletRequest request) {
        try {
            String userEmail = getUserEmailFromContext(authentication, request);
            if (userEmail == null || userEmail.isBlank()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of(
                    "message", "Unable to determine current user",
                    "status", "error"
                ));
            }
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
    public ResponseEntity<?> getUnreadCount(Authentication authentication, HttpServletRequest request) {
        try {
            String userEmail = getUserEmailFromContext(authentication, request);
            if (userEmail == null || userEmail.isBlank()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of(
                    "message", "Unable to determine current user",
                    "status", "error"
                ));
            }
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
     * Get notifications by type for the current user
     * GET /api/notifications/type/{type}
     */
    @GetMapping("/type/{type}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> getNotificationsByType(
            @PathVariable String type,
            Authentication authentication,
            HttpServletRequest request) {
        try {
            String userEmail = getUserEmailFromContext(authentication, request);
            if (userEmail == null || userEmail.isBlank()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of(
                    "message", "Unable to determine current user",
                    "status", "error"
                ));
            }

            List<Notification> notifications = notificationService.getNotificationsByType(userEmail, type);
            return ResponseEntity.ok(Map.of(
                "message", "Notifications retrieved successfully",
                "count", notifications.size(),
                "notifications", notifications,
                "status", "success"
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                "message", "Error retrieving notifications by type: " + e.getMessage(),
                "status", "error"
            ));
        }
    }

    /**
     * Backward compatible support for frontend/local auth demo.
     */
    private String getUserEmailFromContext(Authentication authentication, HttpServletRequest request) {
        if (authentication != null && authentication.isAuthenticated()) {
            Object principal = authentication.getPrincipal();
            if (principal instanceof OAuth2User oauth2User) {
                Object email = oauth2User.getAttribute("email");
                if (email != null) {
                    return email.toString();
                }
            }

            String name = authentication.getName();
            if (name != null && !name.isBlank() && !"anonymousUser".equals(name)) {
                return name;
            }
        }

        String headerEmail = request.getHeader("X-User-Email");
        if (headerEmail != null && !headerEmail.isBlank()) {
            return headerEmail;
        }

        return request.getParameter("userEmail");
    }
}
