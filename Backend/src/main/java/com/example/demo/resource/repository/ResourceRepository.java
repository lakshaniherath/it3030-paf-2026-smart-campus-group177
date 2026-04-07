package com.example.demo.resource.repository;

import com.example.demo.resource.model.Resource;
import com.example.demo.resource.model.enums.ResourceStatus;
import com.example.demo.resource.model.enums.ResourceType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ResourceRepository extends MongoRepository<Resource, String> {

    Optional<Resource> findByCode(String code);

    // Filter query that supports optional fields using regex for keyword searches
    @Query("{ " +
           "  $and: [ " +
           "    { $or: [ { 'name': { $regex: ?0, $options: 'i' } }, { 'code': { $regex: ?0, $options: 'i' } }, { 'location': { $regex: ?0, $options: 'i' } } ] }, " +
           "    { '?1': { $ne: null } ? 'type': ?1 : { $exists: true } }, " +
           "    { '?2': { $ne: null } ? 'status': ?2 : { $exists: true } }, " +
           "    { 'capacity': { $gte: ?3 } }" +
           "  ]" +
           "}")
    Page<Resource> searchResources(String keyword, ResourceType type, ResourceStatus status, int minCapacity, Pageable pageable);
    
    // A simpler query if regex gets too complex for MongoRepository
    Page<Resource> findByTypeAndStatusAndCapacityGreaterThanEqual(ResourceType type, ResourceStatus status, int capacity, Pageable pageable);
}
