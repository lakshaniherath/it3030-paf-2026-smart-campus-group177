package com.sliit.paf.maintenance;

import com.sliit.paf.maintenance.Ticket;
import com.sliit.paf.maintenance.TicketRepository;
import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;

// මෙන්න මේ Imports ටිකයි අඩුවෙලා තිබුණේ
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

    /**
     * අලුත් ටිකට් එකක් සෑදීම සහ පින්තූර Cloudinary වෙත Upload කිරීම
     */
    public Ticket createTicket(Ticket ticket, MultipartFile[] files) throws IOException {
        List<String> imageUrls = new ArrayList<>();

        // පින්තූර තිබේ නම් ඒවා Cloudinary වෙත යැවීම
        if (files != null && files.length > 0) {
            for (MultipartFile file : files) {
                if (!file.isEmpty()) {
                    // Cloudinary uploader එක පාවිච්චි කර පින්තූරය යැවීම
                    Map uploadResult = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.emptyMap());
                    imageUrls.add(uploadResult.get("url").toString());
                }
            }
        }

        // පින්තූර වල URL ටික Ticket object එකට එකතු කිරීම
        ticket.setImageUrls(imageUrls);
        ticket.setStatus("OPEN"); 
        
        return ticketRepository.save(ticket);
    }

    public List<Ticket> getAllTickets() {
        return ticketRepository.findAll();
    }

    public void deleteTicket(String id) {
        ticketRepository.deleteById(id);
    }

    public Ticket updateStatus(String id, String status) {
        Ticket ticket = ticketRepository.findById(id).orElseThrow(() -> new RuntimeException("Ticket not found"));
        ticket.setStatus(status.replace("\"", "")); 
        return ticketRepository.save(ticket);
    }
}