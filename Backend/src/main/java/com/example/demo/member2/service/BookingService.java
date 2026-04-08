package com.example.demo.member2.service;

import com.example.demo.member2.dto.CreateBookingRequest;
import com.example.demo.member2.dto.UpdateBookingStatusRequest;
import com.example.demo.member2.model.Booking;
import com.example.demo.member2.model.BookingStatus;
import com.example.demo.member2.repository.BookingRepository;
import com.example.demo.model.User;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

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

    public BookingService(BookingRepository bookingRepository) {
        this.bookingRepository = bookingRepository;
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
                        "This resource is already booked for the selected time");
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

        return bookingRepository.save(booking);
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
            return bookingRepository.save(booking);
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

    private boolean isAdmin(User user) {
        return user.getRole() != null && "ADMIN".equalsIgnoreCase(user.getRole());
    }

    private void validateTimeRange(LocalTime startTime, LocalTime endTime) {
        if (!startTime.isBefore(endTime)) {
            throw new ResponseStatusException(BAD_REQUEST, "startTime must be earlier than endTime");
        }
    }
}
