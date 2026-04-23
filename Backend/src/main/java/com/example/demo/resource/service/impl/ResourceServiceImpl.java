package com.example.demo.resource.service.impl;

import com.example.demo.resource.dto.request.ResourceCreateRequest;
import com.example.demo.resource.dto.request.ResourceStatusUpdateRequest;
import com.example.demo.resource.dto.request.ResourceUpdateRequest;
import com.example.demo.resource.dto.response.ResourceResponse;
import com.example.demo.resource.exception.ResourceNotFoundException;
import com.example.demo.resource.mapper.ResourceMapper;
import com.example.demo.resource.model.Resource;
import com.example.demo.resource.model.embedded.AvailabilityWindow;
import com.example.demo.resource.model.enums.ResourceStatus;
import com.example.demo.resource.model.enums.ResourceType;
import com.example.demo.resource.repository.ResourceRepository;
import com.example.demo.resource.service.ResourceService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.UUID;

@Service
public class ResourceServiceImpl implements ResourceService {

    private final ResourceRepository resourceRepository;
    private final ResourceMapper resourceMapper;

    public ResourceServiceImpl(ResourceRepository resourceRepository, ResourceMapper resourceMapper) {
        this.resourceRepository = resourceRepository;
        this.resourceMapper = resourceMapper;
    }

    @Override
    public ResourceResponse createResource(ResourceCreateRequest request) {
        Resource resource = resourceMapper.toEntity(request);
        
        // Auto-generate code if not provided
        if (resource.getCode() == null || resource.getCode().isEmpty()) {
            resource.setCode("RES-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        } else {
            // Check for unique code
            resourceRepository.findByCode(resource.getCode()).ifPresent(r -> {
                throw new IllegalArgumentException("Resource code already exists.");
            });
        }
        
        resource.setCreatedAt(Instant.now());
        resource.setUpdatedAt(Instant.now());
        
        // In a real scenario, this would be fetched from SecurityContext
        resource.setCreatedBy("admin_system");
        resource.setUpdatedBy("admin_system");
        
        Resource savedResource = resourceRepository.save(resource);
        return resourceMapper.toResponse(savedResource);
    }

    @Override
    public ResourceResponse getResourceById(String id) {
        Resource resource = resourceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Resource with ID " + id + " not found."));
        return resourceMapper.toResponse(resource);
    }

    @Override
    public Page<ResourceResponse> getAllResources(String keyword, ResourceType type, ResourceStatus status, int minCapacity, Pageable pageable) {
        // Fallback to simple filtering if the complex $query fails. For standard Spring Data Mongo, we can use Example matchers or custom repos.
        // For production, a MongoTemplate Criteria query in a CustomRepository is safer, but we rely on repository methods here.
        // Doing in-memory simplified search for the assignment purpose if needed, but assuming repo handles it or we map it:
        
        Page<Resource> resources;
        if (keyword != null && !keyword.isEmpty()) {
            if (type != null && status != null) {
                resources = resourceRepository.searchByKeywordAndFilters(keyword, type, status, minCapacity, pageable);
            } else {
                resources = resourceRepository.searchByKeyword(keyword, pageable);
            }
        } else if (type != null && status != null) {
            resources = resourceRepository.findByTypeAndStatusAndCapacityGreaterThanEqual(type, status, minCapacity, pageable);
        } else {
            resources = resourceRepository.findAll(pageable); // Can be improved with dynamic Querydsl or MongoTemplate
        }
        
        return resources.map(resourceMapper::toResponse);
    }

    @Override
    public ResourceResponse updateResource(String id, ResourceUpdateRequest request) {
        Resource resource = resourceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Resource with ID " + id + " not found."));
                
        // Check uniqueness if code is changed
        if (request.getCode() != null && !request.getCode().equals(resource.getCode())) {
            resourceRepository.findByCode(request.getCode()).ifPresent(r -> {
                throw new IllegalArgumentException("Resource code already exists.");
            });
            resource.setCode(request.getCode());
        }
        
        resource.setName(request.getName());
        resource.setType(request.getType());
        resource.setCapacity(request.getCapacity());
        resource.setLocation(request.getLocation());
        resource.setStatus(request.getStatus());
        resource.setDescription(request.getDescription());
        resource.setImageUrl(request.getImageUrl());
        
        if(request.getAvailabilityWindow() != null) {
            AvailabilityWindow window = new AvailabilityWindow(
                    request.getAvailabilityWindow().getStartTime(),
                    request.getAvailabilityWindow().getEndTime(),
                    request.getAvailabilityWindow().getAvailableDays()
            );
            resource.setAvailabilityWindow(window);
        }

        resource.setUpdatedAt(Instant.now());
        Resource updatedResource = resourceRepository.save(resource);
        return resourceMapper.toResponse(updatedResource);
    }

    @Override
    public ResourceResponse updateResourceStatus(String id, ResourceStatusUpdateRequest request) {
        Resource resource = resourceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Resource with ID " + id + " not found."));
                
        resource.setStatus(request.getStatus());
        resource.setUpdatedAt(Instant.now());
        
        Resource updatedResource = resourceRepository.save(resource);
        return resourceMapper.toResponse(updatedResource);
    }

    @Override
    public void deleteResource(String id) {
        Resource resource = resourceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Resource with ID " + id + " not found."));
                
        // Soft delete implementation: Change status to INACTIVE instead of hard removal
        resource.setStatus(ResourceStatus.INACTIVE);
        resource.setUpdatedAt(Instant.now());
        resourceRepository.save(resource);
        
        // If hard delete is strictly required: resourceRepository.delete(resource);
    }
}
