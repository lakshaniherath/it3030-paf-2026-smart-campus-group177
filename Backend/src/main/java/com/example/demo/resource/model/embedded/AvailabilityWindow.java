package com.example.demo.resource.model.embedded;

import java.util.List;

public class AvailabilityWindow {
    private String startTime;
    private String endTime;
    private List<String> availableDays;

    public AvailabilityWindow() {}

    public AvailabilityWindow(String startTime, String endTime, List<String> availableDays) {
        this.startTime = startTime;
        this.endTime = endTime;
        this.availableDays = availableDays;
    }

    public String getStartTime() {
        return startTime;
    }

    public void setStartTime(String startTime) {
        this.startTime = startTime;
    }

    public String getEndTime() {
        return endTime;
    }

    public void setEndTime(String endTime) {
        this.endTime = endTime;
    }

    public List<String> getAvailableDays() {
        return availableDays;
    }

    public void setAvailableDays(List<String> availableDays) {
        this.availableDays = availableDays;
    }
}
