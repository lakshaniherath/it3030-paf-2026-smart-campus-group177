package com.example.demo.member3.repository;

import com.example.demo.member3.model.Ticket;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TicketRepository extends MongoRepository<Ticket, String> {
    List<Ticket> findByResourceId(String resourceId);
    List<Ticket> findByReportedBy(String reportedBy);
}
