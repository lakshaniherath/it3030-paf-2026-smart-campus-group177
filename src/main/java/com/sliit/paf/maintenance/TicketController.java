package com.sliit.paf.maintenance;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/tickets") // [cite: 247]
public class TicketController {

    @Autowired
    private TicketService ticketService;

    // 1. POST Endpoint: ටිකට් එකක් ක්‍රියේට් කිරීම (Individual Requirement)
    @PostMapping
    public Ticket addTicket(@RequestBody Ticket ticket) {
        return ticketService.createTicket(ticket);
    }

    // 2. GET Endpoint: සියලුම ටිකට් බැලීම (Individual Requirement)
    @GetMapping
    public List<Ticket> getAllTickets() {
        return ticketService.getAllTickets();
    }

    // 3. PATCH Endpoint: ටිකට් එකක ස්ටේටස් එක අප්ඩේට් කිරීම (Individual Requirement)
    @PatchMapping("/{id}/status")
    public Ticket updateTicketStatus(@PathVariable String id, @RequestBody String status) {
        return ticketService.updateStatus(id, status);
    }
}
