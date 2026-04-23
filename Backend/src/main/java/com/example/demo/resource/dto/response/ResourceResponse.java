package com.example.demo.resource.dto.response;

import com.example.demo.resource.dto.common.AvailabilityWindowDto;
import com.example.demo.resource.model.enums.ResourceStatus;
import com.example.demo.resource.model.enums.ResourceType;

import java.time.Instant;

public class ResourceResponse {

    private String id;
    private String name;
    private String code;
    private ResourceType type;
    private int capacity;
    private String location;
    private AvailabilityWindowDto availabilityWindow;
    private ResourceStatus status;
    private String description;
    private String imageUrl;
    
    private Instant createdAt;
    private Instant updatedAt;

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }

    public ResourceType getType() { return type; }
    public void setType(ResourceType type) { this.type = type; }

    public int getCapacity() { return capacity; }
    public void setCapacity(int capacity) { this.capacity = capacity; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public AvailabilityWindowDto getAvailabilityWindow() { return availabilityWindow; }
    public void setAvailabilityWindow(AvailabilityWindowDto availabilityWindow) { this.availabilityWindow = availabilityWindow; }

    public ResourceStatus getStatus() { return status; }
    public void setStatus(ResourceStatus status) { this.status = status; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }

    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
}
