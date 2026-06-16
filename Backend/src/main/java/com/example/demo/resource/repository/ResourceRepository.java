package com.example.demo.resource.repository;

import com.example.demo.resource.model.Resource;
import com.example.demo.resource.model.enums.ResourceStatus;
import com.example.demo.resource.model.enums.ResourceType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ResourceRepository extends MongoRepository<Resource, String> {
    Optional<Resource> findByCode(String code);
    Page<Resource> findByTypeAndStatusAndCapacityGreaterThanEqual(ResourceType type, ResourceStatus status, int capacity, Pageable pageable);
}
