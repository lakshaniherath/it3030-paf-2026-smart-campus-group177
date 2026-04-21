package com.sliit.paf.maintenance;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class TicketService {

    @Autowired
    private TicketRepository ticketRepository;

    // අලුත් ටිකට් එකක් සේව් කිරීම
    public Ticket createTicket(Ticket ticket) {
        ticket.setStatus("OPEN"); // 
        return ticketRepository.save(ticket);
    }

    // සියලුම ටිකට් ලබා ගැනීම
    public List<Ticket> getAllTickets() {
        return ticketRepository.findAll();
    }

    // ටිකට් එකක ස්ටේටස් එක වෙනස් කිරීම (Technician ට වැදගත් වේ)
    public Ticket updateStatus(String id, String status) {
        Ticket ticket = ticketRepository.findById(id).orElse(null);
        if (ticket != null) {
            ticket.setStatus(status); // [cite: 170, 171]
            return ticketRepository.save(ticket);
        }
        return null;
    }
}
