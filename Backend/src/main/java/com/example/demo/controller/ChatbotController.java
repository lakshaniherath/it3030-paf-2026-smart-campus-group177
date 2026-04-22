package com.example.demo.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/chatbot")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class ChatbotController {

    /**
     * Get FAQ answers based on user query
     * POST /api/chatbot/ask
     */
    @PostMapping("/ask")
    public ResponseEntity<?> askQuestion(@RequestBody Map<String, String> request) {
        try {
            String question = request.get("question");
            if (question == null || question.trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of(
                    "message", "Question cannot be empty",
                    "status", "error"
                ));
            }

            String answer = findAnswer(question.toLowerCase());
            
            return ResponseEntity.ok(Map.of(
                "message", "Response generated",
                "question", question,
                "answer", answer,
                "type", "FAQ",
                "status", "success"
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                "message", "Error processing question: " + e.getMessage(),
                "status", "error"
            ));
        }
    }

    /**
     * Get all FAQ items
     * GET /api/chatbot/faqs
     */
    @GetMapping("/faqs")
    public ResponseEntity<?> getFAQs() {
        List<Map<String, String>> faqs = getFAQList();
        return ResponseEntity.ok(Map.of(
            "message", "FAQs retrieved successfully",
            "faqs", faqs,
            "count", faqs.size(),
            "status", "success"
        ));
    }

    /**
     * Get FAQ by category
     * GET /api/chatbot/faqs?category={category}
     */
    @GetMapping("/faqs/category")
    public ResponseEntity<?> getFAQsByCategory(@RequestParam String category) {
        List<Map<String, String>> allFaqs = getFAQList();
        List<Map<String, String>> filtered = allFaqs.stream()
            .filter(faq -> faq.get("category").equalsIgnoreCase(category))
            .toList();

        return ResponseEntity.ok(Map.of(
            "message", "FAQs retrieved successfully",
            "category", category,
            "faqs", filtered,
            "count", filtered.size(),
            "status", "success"
        ));
    }

    /**
     * Get all FAQ categories
     * GET /api/chatbot/categories
     */
    @GetMapping("/categories")
    public ResponseEntity<?> getCategories() {
        List<String> categories = Arrays.asList(
            "Booking",
            "Resources",
            "Incidents",
            "Tickets",
            "Notifications",
            "Account",
            "General"
        );
        return ResponseEntity.ok(Map.of(
            "message", "Categories retrieved successfully",
            "categories", categories,
            "count", categories.size(),
            "status", "success"
        ));
    }

    /**
     * Helper method to find answer based on keywords
     */
    private String findAnswer(String question) {
        question = question.toLowerCase();

        // Booking-related questions
        if (question.contains("book") || question.contains("booking") || question.contains("reserve")) {
            if (question.contains("how") || question.contains("process")) {
                return "To create a booking:\n1. Navigate to the Facilities & Assets section\n2. Select the resource you want to book\n3. Choose your date and time range\n4. Enter the purpose and number of attendees\n5. Submit your request\n6. Wait for admin approval\n\nOnce approved, your booking will appear on your dashboard.";
            }
            if (question.contains("conflict") || question.contains("overlap")) {
                return "The system prevents scheduling conflicts. You cannot book a resource if there's already a booking during your selected time. Try selecting a different time slot.";
            }
            if (question.contains("cancel")) {
                return "To cancel a booking:\n1. Go to your bookings\n2. Find the booking you want to cancel\n3. Click the Cancel button\n4. Confirm your cancellation\n\nNote: You can only cancel approved bookings.";
            }
            if (question.contains("approval") || question.contains("approve")) {
                return "Admin users review all pending bookings and either approve or reject them. You'll receive a notification about the status of your booking. Approved bookings allow you to use the resource on the scheduled date and time.";
            }
            return "To make a booking, visit the Facilities section, select a resource, choose your date/time, and submit your request for admin approval.";
        }

        // Incident/Ticket-related questions
        if (question.contains("ticket") || question.contains("incident") || question.contains("report")) {
            if (question.contains("create") || question.contains("report")) {
                return "To report an incident:\n1. Go to the Maintenance & Incidents section\n2. Click 'Create New Ticket'\n3. Select the affected resource/location\n4. Choose a category and priority\n5. Describe the issue in detail\n6. Attach up to 3 images as evidence\n7. Provide your contact details\n8. Submit the ticket\n\nA technician will be assigned to your ticket shortly.";
            }
            if (question.contains("status") || question.contains("track")) {
                return "You can track your ticket status on the Tickets page. The workflow is:\nOPEN → IN_PROGRESS → RESOLVED → CLOSED\n\nYou'll receive notifications when the status changes. Technicians may also add comments with updates.";
            }
            if (question.contains("comment") || question.contains("update")) {
                return "Both users and technicians can add comments to tickets. You'll receive notifications when someone comments on your ticket. Technicians can update the status and add resolution notes.";
            }
            if (question.contains("attachment") || question.contains("image")) {
                return "You can attach up to 3 images per ticket as evidence. Supported formats: JPG, PNG, GIF. Maximum file size: 5MB per image.";
            }
            return "Tickets track maintenance issues and incidents. Create a ticket to report problems, then track its progress through our workflow.";
        }

        // Resource/Facility questions
        if (question.contains("resource") || question.contains("facility") || question.contains("equipment")) {
            if (question.contains("available") || question.contains("check")) {
                return "To check resource availability:\n1. Navigate to Facilities & Assets\n2. Browse or search for the resource\n3. View the availability calendar\n4. See which dates/times are available\n5. Check the resource status (ACTIVE or OUT_OF_SERVICE)";
            }
            if (question.contains("filter") || question.contains("search")) {
                return "You can filter resources by:\n• Type (room, lab, equipment, etc.)\n• Capacity (number of people)\n• Location\n• Status (available/unavailable)\n• Features\n\nUse the search bar to find specific resources.";
            }
            if (question.contains("capacity")) {
                return "Each resource has a maximum capacity listed. Make sure the number of expected attendees doesn't exceed the resource capacity.";
            }
            return "Resources include lecture halls, labs, meeting rooms, and equipment like projectors and cameras. Browse the catalogue to find and book what you need.";
        }

        // Notification questions
        if (question.contains("notification")) {
            if (question.contains("when") || question.contains("receive")) {
                return "You receive notifications for:\n• Booking approvals and rejections\n• Ticket status updates\n• New comments on your tickets\n• System announcements\n\nNotifications appear in your notification panel on the dashboard.";
            }
            if (question.contains("settings") || question.contains("preference")) {
                return "Visit your Profile Settings to manage notification preferences. You can enable/disable notification types based on your preferences.";
            }
            return "The notification system keeps you updated on bookings, tickets, and comments. Check your notification panel for updates.";
        }

        // Account questions
        if (question.contains("account") || question.contains("profile") || question.contains("password")) {
            if (question.contains("login") || question.contains("sign in")) {
                return "To log in:\n1. Click the 'Login' button\n2. Enter your email and password, OR\n3. Click 'Continue with Google' for OAuth login\n4. You'll be redirected to your dashboard\n\nFirst-time users can register with the 'Register' button.";
            }
            if (question.contains("oauth") || question.contains("google")) {
                return "You can log in with your Google account for quick access. On first login, a profile is automatically created with the STUDENT role.";
            }
            if (question.contains("role") || question.contains("admin")) {
                return "Your role determines what features you can access:\n• STUDENT: Basic access (book resources, report incidents)\n• LECTURER: Can view student resources\n• TECHNICIAN: Can manage tickets and updates\n• ADMIN: Full system access and management\n\nContact an admin to change your role.";
            }
            return "You can manage your profile and account settings from the Profile section of your dashboard.";
        }

        // General questions
        if (question.contains("help") || question.contains("how") || question.contains("what")) {
            return "Welcome to the Smart Campus Operations Hub! This system helps manage:\n\n1. **Facilities & Assets**: Browse and book resources\n2. **Bookings**: Request and manage your bookings\n3. **Incidents**: Report and track maintenance issues\n4. **Notifications**: Stay updated on your requests\n5. **Admin Panel**: Manage users and system settings (admins only)\n\nWhat would you like to know more about?";
        }

        // Default response
        return "I'm a Smart Campus FAQ bot. I can help you with:\n\n• **Booking**: How to book facilities and equipment\n• **Incidents**: How to report and track maintenance issues\n• **Resources**: How to search and filter available resources\n• **Notifications**: How to stay updated\n• **Account**: How to log in and manage your profile\n\nFeel free to ask any questions about the Smart Campus system!";
    }

    /**
     * Get full FAQ list
     */
    private List<Map<String, String>> getFAQList() {
        return Arrays.asList(
            createFAQ("How do I create a booking?", 
                "Navigate to Facilities, select a resource, choose date/time, and submit for approval.", 
                "Booking"),
            createFAQ("How do I check resource availability?", 
                "Use the search and filter options to find available resources by type, capacity, and location.", 
                "Resources"),
            createFAQ("Can I cancel a booking?", 
                "Yes, you can cancel approved bookings from your booking list.", 
                "Booking"),
            createFAQ("How do I report an incident?", 
                "Go to Incidents, click 'Create Ticket', fill in details, attach images, and submit.", 
                "Incidents"),
            createFAQ("What file types can I upload?", 
                "You can upload JPG, PNG, and GIF images (max 5MB each, up to 3 per ticket).", 
                "Tickets"),
            createFAQ("When will I get a response to my ticket?", 
                "A technician will be assigned shortly. You'll get notifications for status updates.", 
                "Tickets"),
            createFAQ("How do I log in with Google?", 
                "Click 'Continue with Google', sign in with your Google account, and you're done!", 
                "Account"),
            createFAQ("What roles are available?", 
                "Roles include STUDENT, LECTURER, TECHNICIAN, and ADMIN with different access levels.", 
                "Account"),
            createFAQ("How do I manage notifications?", 
                "Visit Profile Settings to enable/disable notification types.", 
                "Notifications"),
            createFAQ("Is there a conflict if I try to book at the same time as someone else?", 
                "Yes, the system prevents scheduling conflicts. Select a different time slot.", 
                "Booking"),
            createFAQ("Can I add comments to tickets?", 
                "Yes, both users and technicians can add comments for updates and discussions.", 
                "Tickets"),
            createFAQ("What facilities can I book?", 
                "You can book lecture halls, labs, meeting rooms, and equipment like projectors and cameras.", 
                "Resources")
        );
    }

    /**
     * Helper method to create FAQ map
     */
    private Map<String, String> createFAQ(String question, String answer, String category) {
        Map<String, String> faq = new HashMap<>();
        faq.put("question", question);
        faq.put("answer", answer);
        faq.put("category", category);
        return faq;
    }
}
