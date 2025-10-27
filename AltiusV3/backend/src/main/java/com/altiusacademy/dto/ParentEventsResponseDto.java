package com.altiusacademy.dto;

import java.util.List;

public class ParentEventsResponseDto {
    private List<ParentEventDto> events;
    
    public ParentEventsResponseDto() {}
    
    // Getters and Setters
    public List<ParentEventDto> getEvents() {
        return events;
    }
    
    public void setEvents(List<ParentEventDto> events) {
        this.events = events;
    }
}