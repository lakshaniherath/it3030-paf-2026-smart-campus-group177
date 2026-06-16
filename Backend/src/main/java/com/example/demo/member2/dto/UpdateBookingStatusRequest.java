package com.example.demo.member2.dto;

import com.example.demo.member2.model.BookingStatus;
import jakarta.validation.constraints.NotNull;

public class UpdateBookingStatusRequest {
    @NotNull
    private BookingStatus status;

    private String rejectionReason;

    public BookingStatus getStatus() {
        return status;
    }

    public void setStatus(BookingStatus status) {
        this.status = status;
    }

    public String getRejectionReason() {
        return rejectionReason;
    }

    public void setRejectionReason(String rejectionReason) {
        this.rejectionReason = rejectionReason;
    }
}
