package com.altiusacademy.repository.mysql;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.altiusacademy.model.entity.Task;
import com.altiusacademy.model.entity.User;

/**
 * Repositorio MySQL para tareas tradicionales
 */
@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    
    // Tareas por estudiante
    List<Task> findByStudentAndStatus(User student, Task.TaskStatus status);
    
    List<Task> findByStudentOrderByDueDateAsc(User student);
    
    List<Task> findByStudentAndStatusOrderByDueDateAsc(User student, Task.TaskStatus status);
    
    // Tareas por profesor
    List<Task> findByTeacherOrderByCreatedAtDesc(User teacher);
    
    List<Task> findByTeacherAndStatusOrderByCreatedAtDesc(User teacher, Task.TaskStatus status);
    
    // Tareas vencidas
    @Query("SELECT t FROM Task t WHERE t.student = :student AND t.dueDate < :currentDate AND t.status IN ('PENDING', 'IN_PROGRESS')")
    List<Task> findOverdueTasks(@Param("student") User student, @Param("currentDate") LocalDate currentDate);
    
    // Estadísticas
    @Query("SELECT COUNT(t) FROM Task t WHERE t.student = :student AND t.status = :status")
    Long countByStudentAndStatus(@Param("student") User student, @Param("status") Task.TaskStatus status);
    
    @Query("SELECT AVG(t.score) FROM Task t WHERE t.student = :student AND t.score IS NOT NULL")
    Double getAverageScoreByStudent(@Param("student") User student);
    
    // Tareas por materia
    @Query("SELECT t FROM Task t WHERE t.student = :student AND t.subject.id = :subjectId ORDER BY t.dueDate ASC")
    List<Task> findByStudentAndSubject(@Param("student") User student, @Param("subjectId") Long subjectId);
    
    // Tareas recientes
    @Query("SELECT t FROM Task t WHERE t.student = :student AND t.status = 'GRADED' ORDER BY t.gradedAt DESC")
    List<Task> findRecentGradedTasks(@Param("student") User student);
    
    // Métodos para profesor
    @Query("SELECT COUNT(t) FROM Task t WHERE t.teacher.id = :teacherId AND t.score IS NULL AND t.status = 'SUBMITTED'")
    Long countPendingGradingByTeacher(@Param("teacherId") Long teacherId);
    
    @Query("SELECT AVG(t.score) FROM Task t WHERE t.teacher.id = :teacherId AND t.score IS NOT NULL")
    Double getAverageScoreByTeacher(@Param("teacherId") Long teacherId);
    
    @Query("SELECT AVG(CASE WHEN t.status = 'GRADED' THEN 100.0 WHEN t.status = 'SUBMITTED' THEN 75.0 WHEN t.status = 'IN_PROGRESS' THEN 50.0 ELSE 0.0 END) " +
           "FROM Task t WHERE t.teacher.id = :teacherId AND t.subject.id = :subjectId AND t.grade = :grade")
    Double getAverageProgressByTeacherAndSubjectAndGrade(@Param("teacherId") Long teacherId, 
                                                        @Param("subjectId") Long subjectId, 
                                                        @Param("grade") String grade);
    
    // Tareas por materia y grado para calificaciones
    @Query("SELECT t FROM Task t WHERE t.teacher.id = :teacherId AND t.subject.id = :subjectId AND t.grade = :grade ORDER BY t.student.firstName, t.student.lastName")
    List<Task> findByTeacherAndSubjectAndGrade(@Param("teacherId") Long teacherId, 
                                              @Param("subjectId") Long subjectId, 
                                              @Param("grade") String grade);
    
    @Query("SELECT AVG(t.score) FROM Task t WHERE t.student = :student AND t.score IS NOT NULL")
    Double getAverageScoreByStudent(@Param("student") User student);
}
