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

    @Query("{ $or: [ { 'name': { $regex: ?0, $options: 'i' } }, { 'code': { $regex: ?0, $options: 'i' } }, { 'location': { $regex: ?0, $options: 'i' } } ] }")
    Page<Resource> searchByKeyword(String keyword, Pageable pageable);

    @Query("{ $and: [ { $or: [ { 'name': { $regex: ?0, $options: 'i' } }, { 'code': { $regex: ?0, $options: 'i' } }, { 'location': { $regex: ?0, $options: 'i' } } ] }, { 'type': ?1 }, { 'status': ?2 }, { 'capacity': { $gte: ?3 } } ] }")
    Page<Resource> searchByKeywordAndFilters(String keyword, ResourceType type, ResourceStatus status, int minCapacity, Pageable pageable);
    
    // Additional filter methods
    Page<Resource> findByType(ResourceType type, Pageable pageable);
    
    Page<Resource> findByStatus(ResourceStatus status, Pageable pageable);
    
    Page<Resource> findByCapacityGreaterThanEqual(int capacity, Pageable pageable);
    
    Page<Resource> findByTypeAndStatus(ResourceType type, ResourceStatus status, Pageable pageable);
    
    Page<Resource> findByTypeAndCapacityGreaterThanEqual(ResourceType type, int capacity, Pageable pageable);
    
    Page<Resource> findByStatusAndCapacityGreaterThanEqual(ResourceStatus status, int capacity, Pageable pageable);
    
    @Query("{ $and: [ { $or: [ { 'name': { $regex: ?0, $options: 'i' } }, { 'code': { $regex: ?0, $options: 'i' } }, { 'location': { $regex: ?0, $options: 'i' } } ] }, { 'type': ?1 } ] }")
    Page<Resource> searchByKeywordAndType(String keyword, ResourceType type, Pageable pageable);
    
    @Query("{ $and: [ { $or: [ { 'name': { $regex: ?0, $options: 'i' } }, { 'code': { $regex: ?0, $options: 'i' } }, { 'location': { $regex: ?0, $options: 'i' } } ] }, { 'status': ?1 } ] }")
    Page<Resource> searchByKeywordAndStatus(String keyword, ResourceStatus status, Pageable pageable);
    
    @Query("{ $and: [ { $or: [ { 'name': { $regex: ?0, $options: 'i' } }, { 'code': { $regex: ?0, $options: 'i' } }, { 'location': { $regex: ?0, $options: 'i' } } ] }, { 'capacity': { $gte: ?1 } } ] }")
    Page<Resource> searchByKeywordAndCapacity(String keyword, int capacity, Pageable pageable);
    
    @Query("{ $and: [ { $or: [ { 'name': { $regex: ?0, $options: 'i' } }, { 'code': { $regex: ?0, $options: 'i' } }, { 'location': { $regex: ?0, $options: 'i' } } ] }, { 'type': ?1 }, { 'capacity': { $gte: ?2 } } ] }")
    Page<Resource> searchByKeywordTypeCapacity(String keyword, ResourceType type, int capacity, Pageable pageable);
    
    @Query("{ $and: [ { $or: [ { 'name': { $regex: ?0, $options: 'i' } }, { 'code': { $regex: ?0, $options: 'i' } }, { 'location': { $regex: ?0, $options: 'i' } } ] }, { 'status': ?1 }, { 'capacity': { $gte: ?2 } } ] }")
    Page<Resource> searchByKeywordStatusCapacity(String keyword, ResourceStatus status, int capacity, Pageable pageable);
    
    @Query("{ $and: [ { 'type': ?0 }, { 'status': ?1 }, { 'capacity': { $gte: ?2 } } ] }")
    Page<Resource> findByTypeStatusCapacity(ResourceType type, ResourceStatus status, int capacity, Pageable pageable);
}
