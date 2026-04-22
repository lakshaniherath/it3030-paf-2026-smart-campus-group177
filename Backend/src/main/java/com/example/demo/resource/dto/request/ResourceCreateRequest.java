package com.example.demo.resource.dto.request;

import com.example.demo.resource.dto.common.AvailabilityWindowDto;
import com.example.demo.resource.model.enums.ResourceStatus;
import com.example.demo.resource.model.enums.ResourceType;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class ResourceCreateRequest {

    @NotBlank(message = "Name is required")
    private String name;

    private String code;

    @NotNull(message = "Resource type is required")
    private ResourceType type;

    @Min(value = 0, message = "Capacity cannot be negative")
    private int capacity;

    @NotBlank(message = "Location is required")
    private String location;

    private AvailabilityWindowDto availabilityWindow;

    @NotNull(message = "Status is required")
    private ResourceStatus status;

    @Size(max = 500, message = "Description must not exceed 500 characters")
    private String description;

    private String imageUrl;

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
}
