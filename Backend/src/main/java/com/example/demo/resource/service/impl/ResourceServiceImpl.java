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
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.UUID;
import java.util.regex.Pattern;

@Service
public class ResourceServiceImpl implements ResourceService {

    private final ResourceRepository resourceRepository;
    private final ResourceMapper resourceMapper;
    private final MongoTemplate mongoTemplate;

    public ResourceServiceImpl(ResourceRepository resourceRepository,
                                ResourceMapper resourceMapper,
                                MongoTemplate mongoTemplate) {
        this.resourceRepository = resourceRepository;
        this.resourceMapper = resourceMapper;
        this.mongoTemplate = mongoTemplate;
    }

    @Override
    public ResourceResponse createResource(ResourceCreateRequest request) {
        Resource resource = resourceMapper.toEntity(request);

        if (resource.getCode() == null || resource.getCode().isEmpty()) {
            resource.setCode("RES-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        } else {
            resourceRepository.findByCode(resource.getCode()).ifPresent(r -> {
                throw new IllegalArgumentException("Resource code already exists.");
            });
        }

        resource.setCreatedAt(Instant.now());
        resource.setUpdatedAt(Instant.now());
        resource.setCreatedBy("admin_system");
        resource.setUpdatedBy("admin_system");

        return resourceMapper.toResponse(resourceRepository.save(resource));
    }

    @Override
    public ResourceResponse getResourceById(String id) {
        Resource resource = resourceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Resource with ID " + id + " not found."));
        return resourceMapper.toResponse(resource);
    }

    @Override
    public Page<ResourceResponse> getAllResources(String keyword, ResourceType type,
                                                   ResourceStatus status, int minCapacity,
                                                   Pageable pageable) {
        // Build dynamic criteria
        Criteria criteria = new Criteria();

        if (keyword != null && !keyword.isBlank()) {
            Pattern regex = Pattern.compile(keyword.trim(), Pattern.CASE_INSENSITIVE);
            criteria = criteria.orOperator(
                    Criteria.where("name").regex(regex),
                    Criteria.where("code").regex(regex),
                    Criteria.where("location").regex(regex)
            );
        }

        if (type != null) {
            criteria = criteria.and("type").is(type);
        }

        if (status != null) {
            criteria = criteria.and("status").is(status);
        }

        if (minCapacity > 0) {
            criteria = criteria.and("capacity").gte(minCapacity);
        }

        Query query = new Query(criteria).with(pageable);
        Query countQuery = new Query(criteria);

        List<Resource> resources = mongoTemplate.find(query, Resource.class);
        long total = mongoTemplate.count(countQuery, Resource.class);

        List<ResourceResponse> responses = resources.stream()
                .map(resourceMapper::toResponse)
                .toList();

        return new PageImpl<>(responses, pageable, total);
    }

    @Override
    public ResourceResponse updateResource(String id, ResourceUpdateRequest request) {
        Resource resource = resourceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Resource with ID " + id + " not found."));

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

        if (request.getAvailabilityWindow() != null) {
            AvailabilityWindow window = new AvailabilityWindow(
                    request.getAvailabilityWindow().getStartTime(),
                    request.getAvailabilityWindow().getEndTime(),
                    request.getAvailabilityWindow().getAvailableDays()
            );
            resource.setAvailabilityWindow(window);
        }

        resource.setUpdatedAt(Instant.now());
        return resourceMapper.toResponse(resourceRepository.save(resource));
    }

    @Override
    public ResourceResponse updateResourceStatus(String id, ResourceStatusUpdateRequest request) {
        Resource resource = resourceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Resource with ID " + id + " not found."));

        resource.setStatus(request.getStatus());
        resource.setUpdatedAt(Instant.now());
        return resourceMapper.toResponse(resourceRepository.save(resource));
    }

    @Override
    public void deleteResource(String id) {
        Resource resource = resourceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Resource with ID " + id + " not found."));

        resource.setStatus(ResourceStatus.INACTIVE);
        resource.setUpdatedAt(Instant.now());
        resourceRepository.save(resource);
    }
}
