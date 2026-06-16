package com.example.demo.member2.repository;

import com.example.demo.member2.model.Booking;
import com.example.demo.member2.model.BookingStatus;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.time.LocalDate;
import java.util.List;

public interface BookingRepository extends MongoRepository<Booking, String> {
    List<Booking> findByResourceIdAndBookingDateAndStatusIn(String resourceId, LocalDate bookingDate, List<BookingStatus> statuses);

    List<Booking> findByUserIdOrderByBookingDateDescStartTimeDesc(String userId);

    List<Booking> findAllByOrderByBookingDateDescStartTimeDesc();
}
