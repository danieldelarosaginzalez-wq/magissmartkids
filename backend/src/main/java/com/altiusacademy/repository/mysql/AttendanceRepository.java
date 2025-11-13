package com.altiusacademy.repository.mysql;

import com.altiusacademy.model.entity.Attendance;
import com.altiusacademy.model.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface AttendanceRepository extends JpaRepository<Attendance, Long> {
    
    // Buscar asistencia por estudiante y fecha
    Optional<Attendance> findByStudentAndDate(User student, LocalDate date);
    
    // Buscar asistencia por fecha y profesor (para ver toda la asistencia de un día)
    @Query("SELECT a FROM Attendance a WHERE a.date = ?1 AND a.teacher = ?2")
    List<Attendance> findByDateAndTeacher(LocalDate date, User teacher);
    
    // Buscar asistencia por fecha y institución del profesor
    @Query("SELECT a FROM Attendance a WHERE a.date = ?1 AND a.teacher.institution.id = ?2")
    List<Attendance> findByDateAndInstitution(LocalDate date, Long institutionId);
    
    // Historial de asistencia de un estudiante
    List<Attendance> findByStudentOrderByDateDesc(User student);
    
    // Historial de asistencia de un estudiante en un rango de fechas
    @Query("SELECT a FROM Attendance a WHERE a.student = ?1 AND a.date BETWEEN ?2 AND ?3 ORDER BY a.date DESC")
    List<Attendance> findByStudentAndDateBetween(User student, LocalDate startDate, LocalDate endDate);
    
    // Verificar si ya existe asistencia para un estudiante en una fecha específica
    boolean existsByStudentAndDate(User student, LocalDate date);
    
    // Contar asistencias por estado en un rango de fechas
    @Query("SELECT COUNT(a) FROM Attendance a WHERE a.student = ?1 AND a.status = ?2 AND a.date BETWEEN ?3 AND ?4")
    long countByStudentAndStatusAndDateBetween(User student, Attendance.AttendanceStatus status, LocalDate startDate, LocalDate endDate);
    
    // Obtener estadísticas de asistencia por institución y fecha
    @Query("SELECT a.status, COUNT(a) FROM Attendance a WHERE a.teacher.institution.id = ?1 AND a.date = ?2 GROUP BY a.status")
    List<Object[]> getAttendanceStatsByInstitutionAndDate(Long institutionId, LocalDate date);
    
    // Buscar asistencias de estudiantes de una institución específica
    @Query("SELECT a FROM Attendance a WHERE a.student.institution.id = ?1 AND a.date = ?2")
    List<Attendance> findByStudentInstitutionAndDate(Long institutionId, LocalDate date);
}
