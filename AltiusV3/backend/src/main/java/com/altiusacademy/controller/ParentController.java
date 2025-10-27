package com.altiusacademy.controller;

import com.altiusacademy.dto.*;
import com.altiusacademy.service.ParentService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/parent")
@CrossOrigin(origins = "*")
public class ParentController {
    
    private static final Logger log = LoggerFactory.getLogger(ParentController.class);
    
    @Autowired
    private ParentService parentService;
    
    @GetMapping("/stats")
    public ResponseEntity<ParentDashboardStatsDto> getDashboardStats(Authentication authentication) {
        try {
            Long parentId = getUserIdFromAuth(authentication);
            ParentDashboardStatsDto stats = parentService.getDashboardStats(parentId);
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            log.error("Error getting parent dashboard stats: {}", e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }
    
    @GetMapping("/children")
    public ResponseEntity<ParentChildrenResponseDto> getChildren(Authentication authentication) {
        try {
            Long parentId = getUserIdFromAuth(authentication);
            List<ParentChildDto> children = parentService.getChildren(parentId);
            
            ParentChildrenResponseDto response = new ParentChildrenResponseDto();
            response.setChildren(children);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error getting parent children: {}", e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }
    
    @GetMapping("/events")
    public ResponseEntity<ParentEventsResponseDto> getUpcomingEvents(Authentication authentication) {
        try {
            Long parentId = getUserIdFromAuth(authentication);
            List<ParentEventDto> events = parentService.getUpcomingEvents(parentId);
            
            ParentEventsResponseDto response = new ParentEventsResponseDto();
            response.setEvents(events);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error getting parent events: {}", e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }
    
    private Long getUserIdFromAuth(Authentication authentication) {
        // TODO: Implementar extracción real del JWT
        return 1L; // Temporal para testing
    }
}