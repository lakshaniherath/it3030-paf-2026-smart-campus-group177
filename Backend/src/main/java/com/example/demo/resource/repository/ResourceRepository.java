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
    
    // A simpler query if regex gets too complex for MongoRepository
    Page<Resource> findByTypeAndStatusAndCapacityGreaterThanEqual(ResourceType type, ResourceStatus status, int capacity, Pageable pageable);
}
