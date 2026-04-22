package com.example.demo.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
<<<<<<< HEAD
import java.time.LocalDateTime;
=======
import java.util.Date;
>>>>>>> member-01

@Document(collection = "notifications")
public class Notification {
    @Id
    private String id;
<<<<<<< HEAD
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
=======
    private String recipientEmail;
    private String message;
    private boolean isRead = false;
    private Date timestamp = new Date();
>>>>>>> member-01

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
<<<<<<< HEAD

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
=======
    public String getRecipientEmail() { return recipientEmail; }
    public void setRecipientEmail(String email) { this.recipientEmail = email; }
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    public boolean isRead() { return isRead; }
    public void setRead(boolean read) { isRead = read; }
>>>>>>> member-01
}