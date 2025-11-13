package com.altiusacademy.service;

import com.altiusacademy.model.entity.Attendance;
import com.altiusacademy.model.entity.User;
import com.altiusacademy.repository.mysql.AttendanceRepository;
import com.altiusacademy.repository.mysql.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class AttendanceService {
    
    private static final Logger logger = LoggerFactory.getLogger(AttendanceService.class);
    
    @Autowired
    private AttendanceRepository attendanceRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    /**
     * Marcar asistencia de un estudiante
     */
    public Attendance markAttendance(Long studentId, Long teacherId, LocalDate date, 
                                   Attendance.AttendanceStatus status, String comments) {
        logger.info("Marcando asistencia - Estudiante: {}, Profesor: {}, Fecha: {}, Estado: {}", 
                   studentId, teacherId, date, status);
        
        // Verificar que el estudiante existe
        Optional<User> studentOpt = userRepository.findById(studentId);
        if (!studentOpt.isPresent()) {
            throw new RuntimeException("Estudiante no encontrado");
        }
        
        // Verificar que el profesor existe
        Optional<User> teacherOpt = userRepository.findById(teacherId);
        if (!teacherOpt.isPresent()) {
            throw new RuntimeException("Profesor no encontrado");
        }
        
        User student = studentOpt.get();
        User teacher = teacherOpt.get();
        
        // Verificar que el estudiante y profesor pertenecen a la misma institución
        if (!student.getInstitution().getId().equals(teacher.getInstitution().getId())) {
            throw new RuntimeException("El estudiante y profesor deben pertenecer a la misma institución");
        }
        
        // Verificar si ya existe asistencia para este estudiante en esta fecha
        Optional<Attendance> existingAttendance = attendanceRepository.findByStudentAndDate(student, date);
        
        Attendance attendance;
        if (existingAttendance.isPresent()) {
            // Actualizar asistencia existente
            attendance = existingAttendance.get();
            attendance.setStatus(status);
            attendance.setComments(comments);
            logger.info("Actualizando asistencia existente para estudiante: {}", student.getEmail());
        } else {
            // Crear nueva asistencia
            attendance = new Attendance(student, teacher, date, status);
            attendance.setComments(comments);
            logger.info("Creando nueva asistencia para estudiante: {}", student.getEmail());
        }
        
        Attendance savedAttendance = attendanceRepository.save(attendance);
        logger.info("Asistencia guardada exitosamente: {}", savedAttendance.getId());
        
        return savedAttendance;
    }
    
    /**
     * Obtener asistencia por fecha y profesor
     */
    public List<Attendance> getAttendanceByDateAndTeacher(LocalDate date, Long teacherId) {
        logger.info("Obteniendo asistencia por fecha: {} y profesor: {}", date, teacherId);
        
        Optional<User> teacherOpt = userRepository.findById(teacherId);
        if (!teacherOpt.isPresent()) {
            throw new RuntimeException("Profesor no encontrado");
        }
        
        return attendanceRepository.findByDateAndTeacher(date, teacherOpt.get());
    }
    
    /**
     * Obtener asistencia por fecha e institución
     */
    public List<Attendance> getAttendanceByDateAndInstitution(LocalDate date, Long institutionId) {
        logger.info("Obteniendo asistencia por fecha: {} e institución: {}", date, institutionId);
        return attendanceRepository.findByDateAndInstitution(date, institutionId);
    }
    
    /**
     * Obtener historial de asistencia de un estudiante
     */
    public List<Attendance> getStudentAttendanceHistory(Long studentId, Long teacherInstitutionId) {
        logger.info("Obteniendo historial de asistencia del estudiante: {}", studentId);
        
        Optional<User> studentOpt = userRepository.findById(studentId);
        if (!studentOpt.isPresent()) {
            throw new RuntimeException("Estudiante no encontrado");
        }
        
        User student = studentOpt.get();
        
        // Verificar que el estudiante pertenece a la misma institución del profesor
        if (!student.getInstitution().getId().equals(teacherInstitutionId)) {
            throw new RuntimeException("No tienes permisos para ver la asistencia de este estudiante");
        }
        
        return attendanceRepository.findByStudentOrderByDateDesc(student);
    }
    
    /**
     * Obtener estadísticas de asistencia por institución y fecha
     */
    public List<Object[]> getAttendanceStats(Long institutionId, LocalDate date) {
        logger.info("Obteniendo estadísticas de asistencia - Institución: {}, Fecha: {}", institutionId, date);
        return attendanceRepository.getAttendanceStatsByInstitutionAndDate(institutionId, date);
    }
    
    /**
     * Verificar si ya existe asistencia para un estudiante en una fecha
     */
    public boolean hasAttendanceForDate(Long studentId, LocalDate date) {
        Optional<User> studentOpt = userRepository.findById(studentId);
        if (!studentOpt.isPresent()) {
            return false;
        }
        
        return attendanceRepository.existsByStudentAndDate(studentOpt.get(), date);
    }
    
    /**
     * Obtener asistencia específica por estudiante y fecha
     */
    public Optional<Attendance> getAttendanceByStudentAndDate(Long studentId, LocalDate date) {
        Optional<User> studentOpt = userRepository.findById(studentId);
        if (!studentOpt.isPresent()) {
            return Optional.empty();
        }
        
        return attendanceRepository.findByStudentAndDate(studentOpt.get(), date);
    }
    
    /**
     * Eliminar asistencia
     */
    public void deleteAttendance(Long attendanceId, Long teacherInstitutionId) {
        logger.info("Eliminando asistencia: {}", attendanceId);
        
        Optional<Attendance> attendanceOpt = attendanceRepository.findById(attendanceId);
        if (!attendanceOpt.isPresent()) {
            throw new RuntimeException("Asistencia no encontrada");
        }
        
        Attendance attendance = attendanceOpt.get();
        
        // Verificar que el profesor tiene permisos para eliminar esta asistencia
        if (!attendance.getTeacher().getInstitution().getId().equals(teacherInstitutionId)) {
            throw new RuntimeException("No tienes permisos para eliminar esta asistencia");
        }
        
        attendanceRepository.delete(attendance);
        logger.info("Asistencia eliminada exitosamente: {}", attendanceId);
    }
}