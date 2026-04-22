package com.example.demo.resource.mapper;

import com.example.demo.resource.dto.common.AvailabilityWindowDto;
import com.example.demo.resource.dto.request.ResourceCreateRequest;
import com.example.demo.resource.dto.response.ResourceResponse;
import com.example.demo.resource.model.Resource;
import com.example.demo.resource.model.embedded.AvailabilityWindow;
import org.springframework.stereotype.Component;

@Component
public class ResourceMapper {

    public Resource toEntity(ResourceCreateRequest request) {
        if (request == null) return null;
        
        Resource resource = new Resource();
        resource.setName(request.getName());
        resource.setCode(request.getCode());
        resource.setType(request.getType());
        resource.setCapacity(request.getCapacity());
        resource.setLocation(request.getLocation());
        resource.setStatus(request.getStatus());
        resource.setDescription(request.getDescription());
        resource.setImageUrl(request.getImageUrl());
        
        if (request.getAvailabilityWindow() != null) {
            resource.setAvailabilityWindow(toEntity(request.getAvailabilityWindow()));
        }
        
        return resource;
    }

    public ResourceResponse toResponse(Resource resource) {
        if (resource == null) return null;
        
        ResourceResponse response = new ResourceResponse();
        response.setId(resource.getId());
        response.setName(resource.getName());
        response.setCode(resource.getCode());
        response.setType(resource.getType());
        response.setCapacity(resource.getCapacity());
        response.setLocation(resource.getLocation());
        response.setStatus(resource.getStatus());
        response.setDescription(resource.getDescription());
        response.setImageUrl(resource.getImageUrl());
        response.setCreatedAt(resource.getCreatedAt());
        response.setUpdatedAt(resource.getUpdatedAt());
        
        if (resource.getAvailabilityWindow() != null) {
            response.setAvailabilityWindow(toDto(resource.getAvailabilityWindow()));
        }
        
        return response;
    }

    private AvailabilityWindow toEntity(AvailabilityWindowDto dto) {
        if (dto == null) return null;
        return new AvailabilityWindow(dto.getStartTime(), dto.getEndTime(), dto.getAvailableDays());
    }

    private AvailabilityWindowDto toDto(AvailabilityWindow entity) {
        if (entity == null) return null;
        AvailabilityWindowDto dto = new AvailabilityWindowDto();
        dto.setStartTime(entity.getStartTime());
        dto.setEndTime(entity.getEndTime());
        dto.setAvailableDays(entity.getAvailableDays());
        return dto;
    }
}
