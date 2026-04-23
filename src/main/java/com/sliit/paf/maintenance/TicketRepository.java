package com.sliit.paf.maintenance;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TicketRepository extends MongoRepository<Ticket, String> {
    
    List<Ticket> findByResourceId(String resourceId);
    
    
    List<Ticket> findByReportedBy(String reportedBy);
}