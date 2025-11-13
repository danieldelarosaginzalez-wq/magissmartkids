package com.altiusacademy.controller;

import com.altiusacademy.model.entity.Attendance;
import com.altiusacademy.model.entity.User;
import com.altiusacademy.repository.mysql.UserRepository;
import com.altiusacademy.service.AttendanceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/attendance")
@CrossOrigin(origins = "*")
public class AttendanceController {
    
    @Autowired
    private AttendanceService attendanceService;
    
    @Autowired
    private UserRepository userRepository;
    
    /**
     * Marcar asistencia - Solo profesores
     */
    @PostMapping
    @PreAuthorize("hasRole('TEACHER')")
    public ResponseEntity<?> markAttendance(@RequestBody Map<String, Object> attendanceData, Authentication authentication) {
        try {
            System.out.println("📝 Marcando asistencia");
            
            // Obtener el profesor autenticado
            Optional<User> teacherOpt = userRepository.findByEmail(authentication.getName());
            if (teacherOpt.isEmpty()) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "Profesor no encontrado");
                return ResponseEntity.badRequest().body(response);
            }
            
            User teacher = teacherOpt.get();
            if (teacher.getInstitution() == null) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "El profesor no tiene una institución asignada");
                return ResponseEntity.badRequest().body(response);
            }
            
            // Extraer datos del request
            Long studentId = Long.valueOf(attendanceData.get("studentId").toString());
            String dateStr = (String) attendanceData.get("date");
            String statusStr = (String) attendanceData.get("status");
            String comments = (String) attendanceData.get("comments");
            
            LocalDate date = LocalDate.parse(dateStr);
            Attendance.AttendanceStatus status = Attendance.AttendanceStatus.valueOf(statusStr.toUpperCase());
            
            Attendance attendance = attendanceService.markAttendance(
                studentId, teacher.getId(), date, status, comments
            );
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Asistencia marcada correctamente");
            response.put("attendance", Map.of(
                "id", attendance.getId(),
                "studentId", attendance.getStudent().getId(),
                "studentName", attendance.getStudent().getFirstName() + " " + attendance.getStudent().getLastName(),
                "teacherId", attendance.getTeacher().getId(),
                "teacherName", attendance.getTeacher().getFirstName() + " " + attendance.getTeacher().getLastName(),
                "date", attendance.getDate().toString(),
                "status", attendance.getStatus().name(),
                "statusDisplay", attendance.getStatus().getDisplayName(),
                "comments", attendance.getComments() != null ? attendance.getComments() : ""
            ));
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            System.err.println("❌ Error marcando asistencia: " + e.getMessage());
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    /**
     * Obtener asistencia por fecha - Solo profesores
     */
    @GetMapping("/date/{date}")
    @PreAuthorize("hasRole('TEACHER')")
    public ResponseEntity<?> getAttendanceByDate(@PathVariable String date, Authentication authentication) {
        try {
            System.out.println("📅 Obteniendo asistencia por fecha: " + date);
            
            // Obtener el profesor autenticado
            Optional<User> teacherOpt = userRepository.findByEmail(authentication.getName());
            if (teacherOpt.isEmpty()) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "Profesor no encontrado");
                return ResponseEntity.badRequest().body(response);
            }
            
            User teacher = teacherOpt.get();
            if (teacher.getInstitution() == null) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "El profesor no tiene una institución asignada");
                return ResponseEntity.badRequest().body(response);
            }
            
            LocalDate attendanceDate = LocalDate.parse(date);
            List<Attendance> attendances = attendanceService.getAttendanceByDateAndInstitution(
                attendanceDate, teacher.getInstitution().getId()
            );
            
            List<Map<String, Object>> attendanceList = attendances.stream()
                .map(attendance -> {
                    Map<String, Object> attendanceMap = new HashMap<>();
                    attendanceMap.put("id", attendance.getId());
                    attendanceMap.put("studentId", attendance.getStudent().getId());
                    attendanceMap.put("studentName", attendance.getStudent().getFirstName() + " " + attendance.getStudent().getLastName());
                    attendanceMap.put("studentEmail", attendance.getStudent().getEmail());
                    attendanceMap.put("teacherId", attendance.getTeacher().getId());
                    attendanceMap.put("teacherName", attendance.getTeacher().getFirstName() + " " + attendance.getTeacher().getLastName());
                    attendanceMap.put("date", attendance.getDate().toString());
                    attendanceMap.put("status", attendance.getStatus().name());
                    attendanceMap.put("statusDisplay", attendance.getStatus().getDisplayName());
                    attendanceMap.put("comments", attendance.getComments() != null ? attendance.getComments() : "");
                    return attendanceMap;
                })
                .collect(Collectors.toList());
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Asistencia obtenida correctamente");
            response.put("attendances", attendanceList);
            response.put("date", date);
            response.put("total", attendanceList.size());
            response.put("institution", teacher.getInstitution().getName());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            System.err.println("❌ Error obteniendo asistencia por fecha: " + e.getMessage());
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Error al obtener asistencia: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    /**
     * Obtener historial de asistencia de un estudiante - Solo profesores
     */
    @GetMapping("/student/{studentId}")
    @PreAuthorize("hasRole('TEACHER')")
    public ResponseEntity<?> getStudentAttendanceHistory(@PathVariable Long studentId, Authentication authentication) {
        try {
            System.out.println("📊 Obteniendo historial de asistencia del estudiante: " + studentId);
            
            // Obtener el profesor autenticado
            Optional<User> teacherOpt = userRepository.findByEmail(authentication.getName());
            if (teacherOpt.isEmpty()) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "Profesor no encontrado");
                return ResponseEntity.badRequest().body(response);
            }
            
            User teacher = teacherOpt.get();
            if (teacher.getInstitution() == null) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "El profesor no tiene una institución asignada");
                return ResponseEntity.badRequest().body(response);
            }
            
            List<Attendance> attendances = attendanceService.getStudentAttendanceHistory(
                studentId, teacher.getInstitution().getId()
            );
            
            List<Map<String, Object>> attendanceHistory = attendances.stream()
                .map(attendance -> {
                    Map<String, Object> attendanceMap = new HashMap<>();
                    attendanceMap.put("id", attendance.getId());
                    attendanceMap.put("date", attendance.getDate().toString());
                    attendanceMap.put("status", attendance.getStatus().name());
                    attendanceMap.put("statusDisplay", attendance.getStatus().getDisplayName());
                    attendanceMap.put("comments", attendance.getComments() != null ? attendance.getComments() : "");
                    attendanceMap.put("teacherName", attendance.getTeacher().getFirstName() + " " + attendance.getTeacher().getLastName());
                    return attendanceMap;
                })
                .collect(Collectors.toList());
            
            // Obtener información del estudiante
            Optional<User> studentOpt = userRepository.findById(studentId);
            String studentName = studentOpt.isPresent() ? 
                studentOpt.get().getFirstName() + " " + studentOpt.get().getLastName() : "Estudiante no encontrado";
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Historial de asistencia obtenido correctamente");
            response.put("studentId", studentId);
            response.put("studentName", studentName);
            response.put("attendances", attendanceHistory);
            response.put("total", attendanceHistory.size());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            System.err.println("❌ Error obteniendo historial de asistencia: " + e.getMessage());
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    /**
     * Obtener estadísticas de asistencia - Solo profesores
     */
    @GetMapping("/stats/{date}")
    @PreAuthorize("hasRole('TEACHER')")
    public ResponseEntity<?> getAttendanceStats(@PathVariable String date, Authentication authentication) {
        try {
            System.out.println("📈 Obteniendo estadísticas de asistencia para fecha: " + date);
            
            // Obtener el profesor autenticado
            Optional<User> teacherOpt = userRepository.findByEmail(authentication.getName());
            if (teacherOpt.isEmpty()) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "Profesor no encontrado");
                return ResponseEntity.badRequest().body(response);
            }
            
            User teacher = teacherOpt.get();
            if (teacher.getInstitution() == null) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "El profesor no tiene una institución asignada");
                return ResponseEntity.badRequest().body(response);
            }
            
            LocalDate statsDate = LocalDate.parse(date);
            List<Object[]> stats = attendanceService.getAttendanceStats(teacher.getInstitution().getId(), statsDate);
            
            Map<String, Long> statsMap = new HashMap<>();
            for (Object[] stat : stats) {
                Attendance.AttendanceStatus status = (Attendance.AttendanceStatus) stat[0];
                Long count = (Long) stat[1];
                statsMap.put(status.name(), count);
            }
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Estadísticas obtenidas correctamente");
            response.put("date", date);
            response.put("institution", teacher.getInstitution().getName());
            response.put("stats", statsMap);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            System.err.println("❌ Error obteniendo estadísticas: " + e.getMessage());
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Error al obtener estadísticas: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
}