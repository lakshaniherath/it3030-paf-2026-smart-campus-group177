package com.example.demo.member2.service;

import com.example.demo.member2.dto.ConflictInfo;
import com.example.demo.member2.dto.CreateBookingRequest;
import com.example.demo.member2.dto.UpdateBookingStatusRequest;
import com.example.demo.member2.model.Booking;
import com.example.demo.member2.model.BookingStatus;
import com.example.demo.member2.repository.BookingRepository;
import com.example.demo.model.User;
import com.example.demo.service.NotificationService;
import com.example.demo.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import static org.springframework.http.HttpStatus.BAD_REQUEST;
import static org.springframework.http.HttpStatus.CONFLICT;
import static org.springframework.http.HttpStatus.FORBIDDEN;
import static org.springframework.http.HttpStatus.NOT_FOUND;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final NotificationService notificationService;
    private final UserRepository userRepository;

    public BookingService(BookingRepository bookingRepository, 
                         NotificationService notificationService,
                         UserRepository userRepository) {
        this.bookingRepository = bookingRepository;
        this.notificationService = notificationService;
        this.userRepository = userRepository;
    }

    public Booking createBooking(CreateBookingRequest request, User actor) {
        validateTimeRange(request.getStartTime(), request.getEndTime());

        List<Booking> existing = bookingRepository.findByResourceIdAndBookingDateAndStatusIn(
                request.getResourceId(),
                request.getBookingDate(),
                List.of(BookingStatus.PENDING, BookingStatus.APPROVED)
        );

        for (Booking current : existing) {
            boolean hasOverlap = request.getStartTime().isBefore(current.getEndTime())
                    && request.getEndTime().isAfter(current.getStartTime());
            if (hasOverlap) {
                throw new ResponseStatusException(CONFLICT,
                        "CONFLICT:" + current.getStartTime() + "-" + current.getEndTime() + ":" + current.getPurpose() + ":" + current.getStatus());
            }
        }

        Booking booking = new Booking();
        booking.setResourceId(request.getResourceId());
        booking.setUserId(actor.getId());
        booking.setBookingDate(request.getBookingDate());
        booking.setStartTime(request.getStartTime());
        booking.setEndTime(request.getEndTime());
        booking.setPurpose(request.getPurpose());
        booking.setExpectedAttendees(request.getExpectedAttendees());
        booking.setStatus(BookingStatus.PENDING);
        booking.setCreatedAt(LocalDateTime.now());
        booking.setUpdatedAt(LocalDateTime.now());

        Booking savedBooking = bookingRepository.save(booking);
        
        // Send notification to all admins about new booking request
        try {
            List<User> admins = userRepository.findByRole("ADMIN");
            for (User admin : admins) {
                if (admin.getEmail() != null) {
                    String title = "New Booking Request";
                    String message = "New booking request from " + actor.getName() + " for " + 
                                   request.getResourceId() + " on " + request.getBookingDate() + 
                                   " (" + request.getStartTime() + " - " + request.getEndTime() + ")";
                    
                    notificationService.createNotification(
                        admin.getEmail(),
                        "BOOKING",
                        title,
                        message,
                        savedBooking.getId()
                    );
                }
            }
        } catch (Exception e) {
            // Log but don't fail the booking creation if notification fails
            System.err.println("Failed to send admin notification: " + e.getMessage());
        }
        
        return savedBooking;
    }

    public List<Booking> getBookings(User actor, BookingStatus status, String bookingDate) {
        List<Booking> data = isAdmin(actor)
                ? bookingRepository.findAllByOrderByBookingDateDescStartTimeDesc()
                : bookingRepository.findByUserIdOrderByBookingDateDescStartTimeDesc(actor.getId());

        return data.stream()
                .filter(b -> status == null || b.getStatus() == status)
                .filter(b -> bookingDate == null || bookingDate.isBlank() || b.getBookingDate().toString().equals(bookingDate))
                .collect(Collectors.toList());
    }

    public Booking updateBookingStatus(String bookingId, UpdateBookingStatusRequest request, User actor) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Booking not found"));

        if (isAdmin(actor)) {
            if (request.getStatus() != BookingStatus.APPROVED && request.getStatus() != BookingStatus.REJECTED) {
                throw new ResponseStatusException(BAD_REQUEST, "Admin can only set APPROVED or REJECTED");
            }
            if (request.getStatus() == BookingStatus.REJECTED
                    && (request.getRejectionReason() == null || request.getRejectionReason().isBlank())) {
                throw new ResponseStatusException(BAD_REQUEST, "rejectionReason is required when status is REJECTED");
            }

            booking.setStatus(request.getStatus());
            booking.setRejectionReason(request.getStatus() == BookingStatus.REJECTED ? request.getRejectionReason() : null);
            booking.setUpdatedAt(LocalDateTime.now());
            Booking savedBooking = bookingRepository.save(booking);
            
            // Send notification to user about booking status change
            try {
                User bookingOwner = userRepository.findById(booking.getUserId()).orElse(null);
                if (bookingOwner != null && bookingOwner.getEmail() != null) {
                    String status = request.getStatus().name();
                    String title = "Booking " + status;
                    String message = request.getStatus() == BookingStatus.APPROVED
                        ? "Your booking for " + booking.getResourceId() + " on " + booking.getBookingDate() + " has been approved."
                        : "Your booking for " + booking.getResourceId() + " on " + booking.getBookingDate() + " has been rejected. Reason: " + request.getRejectionReason();
                    
                    notificationService.createNotification(
                        bookingOwner.getEmail(),
                        "BOOKING",
                        title,
                        message,
                        bookingId
                    );
                }
            } catch (Exception e) {
                // Log but don't fail the booking update if notification fails
                System.err.println("Failed to send booking notification: " + e.getMessage());
            }
            
            return savedBooking;
        }

        if (!booking.getUserId().equals(actor.getId())) {
            throw new ResponseStatusException(FORBIDDEN, "You can update only your own booking");
        }

        if (request.getStatus() != BookingStatus.CANCELLED) {
            throw new ResponseStatusException(FORBIDDEN, "User can only set CANCELLED status");
        }

        if (booking.getStatus() != BookingStatus.APPROVED) {
            throw new ResponseStatusException(CONFLICT, "Only APPROVED bookings can be cancelled");
        }

        booking.setStatus(BookingStatus.CANCELLED);
        booking.setRejectionReason(null);
        booking.setUpdatedAt(LocalDateTime.now());
        return bookingRepository.save(booking);
    }

    public void deleteBooking(String bookingId, User actor) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Booking not found"));

        if (!isAdmin(actor) && !booking.getUserId().equals(actor.getId())) {
            throw new ResponseStatusException(FORBIDDEN, "You can delete only your own booking");
        }

        if (booking.getStatus() != BookingStatus.PENDING) {
            throw new ResponseStatusException(CONFLICT, "Only PENDING bookings can be deleted");
        }

        bookingRepository.delete(booking);
    }

    public List<ConflictInfo> getAvailability(String resourceId, LocalDate date) {
        List<Booking> existing = bookingRepository.findByResourceIdAndBookingDateAndStatusIn(
                resourceId, date, List.of(BookingStatus.PENDING, BookingStatus.APPROVED));
        return existing.stream()
                .map(b -> new ConflictInfo(
                        b.getId(),
                        b.getStartTime().toString(),
                        b.getEndTime().toString(),
                        b.getPurpose(),
                        b.getStatus().name()))
                .collect(Collectors.toList());
    }

    private boolean isAdmin(User user) {
        return user.getRole() != null && "ADMIN".equalsIgnoreCase(user.getRole());
    }

    private void validateTimeRange(LocalTime startTime, LocalTime endTime) {
        if (!startTime.isBefore(endTime)) {
            throw new ResponseStatusException(BAD_REQUEST, "startTime must be earlier than endTime");
        }
    }
}
