package com.altiusacademy.controller;

import com.altiusacademy.service.PredictionService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/predictions")
@CrossOrigin(origins = "*")
public class PredictionController {
    
    private final PredictionService predictionService;
    
    public PredictionController(PredictionService predictionService) {
        this.predictionService = predictionService;
    }
    
    @GetMapping("/student-performance")
    @PreAuthorize("hasAnyRole('TEACHER', 'ADMIN', 'COORDINATOR')")
    public ResponseEntity<Map<String, Object>> predictStudentPerformance(
            @RequestParam String grade) {
        try {
            Map<String, Object> predictions = predictionService.predictStudentPerformance(grade);
            return ResponseEntity.ok(predictions);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "error", e.getMessage()
            ));
        }
    }
}
