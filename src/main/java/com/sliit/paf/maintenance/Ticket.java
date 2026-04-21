package com.sliit.paf.maintenance;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.List;

@Document(collection = "tickets")
public class Ticket {
    @Id
    private String id;
    private String resourceId; // Member 1 ගේ Resource ID එකට සම්බන්ධ කිරීමට
    private String description;
    private String priority; // LOW, MEDIUM, HIGH
    private String status; // OPEN, IN_PROGRESS, RESOLVED, CLOSED [cite: 41]
    private List<String> imageUrls; // පින්තූර 3ක් දක්වා [cite: 40]
    private String reportedBy;

    public Ticket() {}

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getResourceId() { return resourceId; }
    public void setResourceId(String resourceId) { this.resourceId = resourceId; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getPriority() { return priority; }
    public void setPriority(String priority) { this.priority = priority; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public List<String> getImageUrls() { return imageUrls; }
    public void setImageUrls(List<String> imageUrls) { this.imageUrls = imageUrls; }
}