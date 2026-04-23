package com.sliit.paf.maintenance;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import jakarta.validation.Valid;

import java.util.List;

@RestController
@RequestMapping("/api/tickets")
/**
 * CORS Fix: ඔයාගේ Frontend එක දුවන්නේ Port 3000 එකේ නිසා 
 * අපි මෙතනට 3000 සහ 5173 (Vite default) යන දෙකම ඇතුළත් කළා.
 */
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"}, 
            allowedHeaders = "*", 
            methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PATCH, RequestMethod.DELETE, RequestMethod.OPTIONS})
public class TicketController {

    @Autowired
    private TicketService ticketService;

    // 1. GET - සියලුම ටිකට් ලබා ගැනීම (Dashboard එක සඳහා)
    @GetMapping
    public ResponseEntity<List<Ticket>> getAllTickets() {
        return ResponseEntity.ok(ticketService.getAllTickets());
    }

    // 2. GET - එක ටිකට් එකක් ID එකෙන් ලබා ගැනීම (Detail Page එක සඳහා)
    @GetMapping("/{id}")
    public ResponseEntity<Ticket> getTicketById(@PathVariable String id) {
        Ticket ticket = ticketService.getTicketById(id);
        if (ticket == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(ticket);
    }

    // 3. POST - අලුත් ටිකට් එකක් සෑදීම (Image Uploads සමඟ)
    @PostMapping(consumes = {"multipart/form-data"})
    public ResponseEntity<Ticket> addTicket(@Valid
            @ModelAttribute Ticket ticket, 
            @RequestParam(value = "files", required = false) MultipartFile[] files
    ) {
        if (ticket.getStatus() == null || ticket.getStatus().isEmpty()) {
            ticket.setStatus("OPEN");
        }
        Ticket savedTicket = ticketService.createTicket(ticket, files);
        return ResponseEntity.status(201).body(savedTicket);
    }

    // 4. PATCH - ටිකට් එකක Status එක Update කිරීම
    @PatchMapping("/{id}/status")
    public ResponseEntity<Ticket> updateTicketStatus(@PathVariable String id, @RequestBody String status) {
        // Axios හරහා එන දත්ත වල Quotes තිබේ නම් ඒවා ඉවත් කිරීම
        String cleanStatus = status.replace("\"", "").trim();
        
        Ticket updated = ticketService.updateStatus(id, cleanStatus);
        if (updated == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(updated);
    }

    // 5. DELETE - ටිකට් එකක් මකා දැමීම
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTicket(@PathVariable String id) {
        ticketService.deleteTicket(id);
        return ResponseEntity.noContent().build();
    }
} 