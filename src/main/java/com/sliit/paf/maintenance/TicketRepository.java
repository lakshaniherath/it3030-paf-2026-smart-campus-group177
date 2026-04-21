package com.sliit.paf.maintenance;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TicketRepository extends MongoRepository<Ticket, String> {
    // යම් විශේෂිත රිසෝස් එකකට අදාළ සියලුම ටිකට් සෙවීමට
    List<Ticket> findByResourceId(String resourceId);
    
    // යම් යූසර් කෙනෙක් දාපු ටිකට් සෙවීමට
    List<Ticket> findByReportedBy(String reportedBy);
}