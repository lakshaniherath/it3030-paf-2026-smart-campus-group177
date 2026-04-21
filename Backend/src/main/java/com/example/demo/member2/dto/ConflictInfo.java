package com.example.demo.member2.dto;

public class ConflictInfo {
    private String bookingId;
    private String startTime;
    private String endTime;
    private String purpose;
    private String status;

    public ConflictInfo(String bookingId, String startTime, String endTime, String purpose, String status) {
        this.bookingId = bookingId;
        this.startTime = startTime;
        this.endTime = endTime;
        this.purpose = purpose;
        this.status = status;
    }

    public String getBookingId() { return bookingId; }
    public String getStartTime() { return startTime; }
    public String getEndTime() { return endTime; }
    public String getPurpose() { return purpose; }
    public String getStatus() { return status; }
}
