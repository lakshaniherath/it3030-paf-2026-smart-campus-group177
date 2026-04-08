package com.example.demo.member2.controller;

import com.example.demo.member2.dto.CreateBookingRequest;
import com.example.demo.member2.dto.UpdateBookingStatusRequest;
import com.example.demo.member2.model.Booking;
import com.example.demo.member2.model.BookingStatus;
import com.example.demo.member2.service.BookingService;
import com.example.demo.member2.service.UserContextService;
import com.example.demo.model.User;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/member2/bookings")
public class BookingController {

    private final BookingService bookingService;
    private final UserContextService userContextService;

    public BookingController(BookingService bookingService, UserContextService userContextService) {
        this.bookingService = bookingService;
        this.userContextService = userContextService;
    }

    @PostMapping
    public ResponseEntity<Booking> createBooking(@Valid @RequestBody CreateBookingRequest request,
                                                 Authentication authentication) {
        User actor = userContextService.getCurrentUser(authentication);
        Booking booking = bookingService.createBooking(request, actor);
        return ResponseEntity.status(HttpStatus.CREATED).body(booking);
    }

    @GetMapping
    public ResponseEntity<List<Booking>> getBookings(@RequestParam(required = false) BookingStatus status,
                                                     @RequestParam(required = false) String bookingDate,
                                                     Authentication authentication) {
        User actor = userContextService.getCurrentUser(authentication);
        List<Booking> bookings = bookingService.getBookings(actor, status, bookingDate);
        return ResponseEntity.ok(bookings);
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Booking> updateStatus(@PathVariable String id,
                                                @Valid @RequestBody UpdateBookingStatusRequest request,
                                                Authentication authentication) {
        User actor = userContextService.getCurrentUser(authentication);
        Booking updated = bookingService.updateBookingStatus(id, request, actor);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBooking(@PathVariable String id,
                                              Authentication authentication) {
        User actor = userContextService.getCurrentUser(authentication);
        bookingService.deleteBooking(id, actor);
        return ResponseEntity.noContent().build();
    }
}
