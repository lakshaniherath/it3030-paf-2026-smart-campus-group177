package com.sliit.paf.maintenance;

import com.sliit.paf.maintenance.Ticket;
import com.sliit.paf.maintenance.TicketService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;

@RestController
@RequestMapping("/api/tickets")

public class TicketController {

    @Autowired
    private TicketService ticketService;

    /**
     * අලුත් ටිකට් එකක් සෑදීම
     * @Valid භාවිත කරන්නේ නැත්තේ 'id' එක null වීම නිසා එන error එක නැති කිරීමටයි.
     */
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Ticket> createTicket(
            @ModelAttribute Ticket ticket, 
            @RequestParam(value = "files", required = false) MultipartFile[] files
    ) {
        try {
            // Service එක හරහා ටිකට් එක සහ පින්තූර Save කිරීම
            Ticket savedTicket = ticketService.createTicket(ticket, files);
            return new ResponseEntity<>(savedTicket, HttpStatus.CREATED);
        } catch (Exception e) {
            e.printStackTrace(); 
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * සියලුම ටිකට් ලබා ගැනීම
     */
    @GetMapping
    public ResponseEntity<List<Ticket>> getAllTickets() {
        return new ResponseEntity<>(ticketService.getAllTickets(), HttpStatus.OK);
    }

    /**
     * ටිකට් එකක් මකා දැමීම
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<HttpStatus> deleteTicket(@PathVariable String id) {
        try {
            ticketService.deleteTicket(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * ටිකට් එකක Status එක වෙනස් කිරීම
     */
    @PatchMapping("/{id}/status")
    public ResponseEntity<Ticket> updateStatus(@PathVariable String id, @RequestBody String status) {
        try {
            Ticket updatedTicket = ticketService.updateStatus(id, status);
            return new ResponseEntity<>(updatedTicket, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}