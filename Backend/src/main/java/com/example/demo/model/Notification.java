package com.example.demo.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Document(collection = "notifications")
public class Notification {
    @Id
    private String id;
    private String userEmail;  // User receiving the notification
    private String type;  // BOOKING, TICKET, COMMENT, SYSTEM
    private String title;  // Notification title
    private String message;  // Notification message
    private String relatedId;  // ID of related booking/ticket
    private boolean read = false;  // Read status
    private LocalDateTime createdAt;  // When notification was created
    private LocalDateTime readAt;  // When notification was read

    // Constructors
    public Notification() {}

    public Notification(String userEmail, String type, String title, String message) {
        this.userEmail = userEmail;
        this.type = type;
        this.title = title;
        this.message = message;
        this.read = false;
        this.createdAt = LocalDateTime.now();
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getUserEmail() { return userEmail; }
    public void setUserEmail(String userEmail) { this.userEmail = userEmail; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public String getRelatedId() { return relatedId; }
    public void setRelatedId(String relatedId) { this.relatedId = relatedId; }

    public boolean isRead() { return read; }
    public void setRead(boolean read) { 
        this.read = read;
        if (read) {
            this.readAt = LocalDateTime.now();
        }
    }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getReadAt() { return readAt; }
    public void setReadAt(LocalDateTime readAt) { this.readAt = readAt; }

    // Legacy compatibility methods
    public String getRecipientEmail() { return userEmail; }
    public void setRecipientEmail(String email) { this.userEmail = email; }
}