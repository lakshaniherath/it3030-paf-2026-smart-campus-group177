package com.example.demo.resource.dto.request;

import com.example.demo.resource.model.enums.ResourceStatus;
import jakarta.validation.constraints.NotNull;

public class ResourceStatusUpdateRequest {

    @NotNull(message = "Status is required")
    private ResourceStatus status;

    public ResourceStatus getStatus() { return status; }
    public void setStatus(ResourceStatus status) { this.status = status; }
}
