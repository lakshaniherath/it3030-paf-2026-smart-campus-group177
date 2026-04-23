package com.example.demo.resource.service;

import com.example.demo.resource.dto.request.ResourceCreateRequest;
import com.example.demo.resource.dto.request.ResourceStatusUpdateRequest;
import com.example.demo.resource.dto.request.ResourceUpdateRequest;
import com.example.demo.resource.dto.response.ResourceResponse;
import com.example.demo.resource.model.enums.ResourceStatus;
import com.example.demo.resource.model.enums.ResourceType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ResourceService {
    
    ResourceResponse createResource(ResourceCreateRequest request);
    
    ResourceResponse getResourceById(String id);
    
    Page<ResourceResponse> getAllResources(String keyword, ResourceType type, ResourceStatus status, int minCapacity, Pageable pageable);
    
    ResourceResponse updateResource(String id, ResourceUpdateRequest request);
    
    ResourceResponse updateResourceStatus(String id, ResourceStatusUpdateRequest request);
    
    void deleteResource(String id); // Performs soft delete implementation
}
