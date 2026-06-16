package com.example.demo.member3.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.example.demo.member3.model.Ticket;
import com.example.demo.member3.repository.TicketRepository;
import com.example.demo.service.NotificationService;
import com.example.demo.repository.UserRepository;
import com.example.demo.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class TicketService {

    @Autowired
    private TicketRepository ticketRepository;

    @Autowired
    private Cloudinary cloudinary;
    
    @Autowired
    private NotificationService notificationService;
    
    @Autowired
    private UserRepository userRepository;

    public Ticket createTicket(Ticket ticket, MultipartFile[] files) throws IOException {
        List<String> imageUrls = new ArrayList<>();

        if (files != null && files.length > 0) {
            for (MultipartFile file : files) {
                if (!file.isEmpty()) {
                    Map uploadResult = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.emptyMap());
                    imageUrls.add(uploadResult.get("url").toString());
                }
            }
        }

        ticket.setImageUrls(imageUrls);
        ticket.setStatus("OPEN");
        Ticket savedTicket = ticketRepository.save(ticket);
        
        // Send notification to admins and technicians about new ticket
        try {
            List<User> admins = userRepository.findByRole("ADMIN");
            List<User> technicians = userRepository.findByRole("TECHNICIAN");
            
            List<User> notifyUsers = new ArrayList<>();
            notifyUsers.addAll(admins);
            notifyUsers.addAll(technicians);
            
            for (User user : notifyUsers) {
                if (user.getEmail() != null) {
                    String title = "New Ticket Created";
                    String message = "New " + ticket.getPriority() + " priority ticket: " + 
                                   ticket.getDescription() + " at " + ticket.getResourceId();
                    
                    notificationService.createNotification(
                        user.getEmail(),
                        "TICKET",
                        title,
                        message,
                        savedTicket.getId()
                    );
                }
            }
        } catch (Exception e) {
            // Log but don't fail the ticket creation if notification fails
            System.err.println("Failed to send ticket notification: " + e.getMessage());
        }
        
        return savedTicket;
    }

    public List<Ticket> getAllTickets() {
        return ticketRepository.findAll();
    }

    public void deleteTicket(String id) {
        ticketRepository.deleteById(id);
    }

    public Ticket updateStatus(String id, String status) {
        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ticket not found: " + id));
        
        String oldStatus = ticket.getStatus();
        String newStatus = status.replace("\"", "").trim();
        ticket.setStatus(newStatus);
        Ticket savedTicket = ticketRepository.save(ticket);
        
        // Send notification to ticket reporter about status change
        if (!oldStatus.equals(newStatus) && ticket.getReportedBy() != null) {
            try {
                String title = "Ticket Status Updated: " + newStatus;
                String message = "Your ticket \"" + ticket.getDescription() + "\" status has been updated from " + oldStatus + " to " + newStatus;
                
                notificationService.createNotification(
                    ticket.getReportedBy(),
                    "TICKET",
                    title,
                    message,
                    id
                );
            } catch (Exception e) {
                // Log but don't fail the ticket update if notification fails
                System.err.println("Failed to send ticket notification: " + e.getMessage());
            }
        }
        
        return savedTicket;
    }
}
