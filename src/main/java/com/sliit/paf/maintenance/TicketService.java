package com.sliit.paf.maintenance;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class TicketService {

    @Autowired
    private TicketRepository ticketRepository;

    @Autowired
    private Cloudinary cloudinary; // Cloudinary Config එකක් තියෙන්න ඕනේ

    // 1. ටිකට් එකක් සෑදීම සහ පින්තූර Upload කිරීම
    public Ticket createTicket(Ticket ticket, MultipartFile[] files) {
        List<String> imageUrls = new ArrayList<>();

        if (files != null && files.length > 0) {
            for (MultipartFile file : files) {
                try {
                    // Cloudinary එකට file එක upload කිරීම
                    Map uploadResult = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.emptyMap());
                    String url = uploadResult.get("url").toString();
                    imageUrls.add(url);
                    System.out.println("Uploaded Image URL: " + url); // Debugging සඳහා
                } catch (IOException e) {
                    System.err.println("Error uploading file: " + e.getMessage());
                }
            }
        }

        ticket.setImageUrls(imageUrls); // Array එකට URLs ටික දානවා
        return ticketRepository.save(ticket);
    }

    // 2. සියලුම ටිකට් ලබා ගැනීම
    public List<Ticket> getAllTickets() {
        return ticketRepository.findAll();
    }

    // 3. ID එකෙන් ටිකට් එකක් සෙවීම
    public Ticket getTicketById(String id) {
        return ticketRepository.findById(id).orElse(null);
    }

    // 4. Status එක Update කිරීම
    public Ticket updateStatus(String id, String status) {
        Optional<Ticket> optionalTicket = ticketRepository.findById(id);
        if (optionalTicket.isPresent()) {
            Ticket ticket = optionalTicket.get();
            ticket.setStatus(status);
            return ticketRepository.save(ticket);
        }
        return null;
    }

    // 5. ටිකට් එකක් මකා දැමීම
    public void deleteTicket(String id) {
        ticketRepository.deleteById(id);
    }
} 