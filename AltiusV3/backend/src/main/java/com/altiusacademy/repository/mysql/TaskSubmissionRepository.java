package com.altiusacademy.repository.mysql;

import com.altiusacademy.model.entity.TaskSubmission;
import com.altiusacademy.model.entity.Task;
import com.altiusacademy.model.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TaskSubmissionRepository extends JpaRepository<TaskSubmission, Long> {
    
    // Buscar entrega por tarea y estudiante
    Optional<TaskSubmission> findByTaskAndStudent(Task task, User student);
    
    // Buscar entregas por estudiante
    List<TaskSubmission> findByStudentOrderBySubmittedAtDesc(User student);
    
    // Buscar entregas por tarea
    List<TaskSubmission> findByTaskOrderBySubmittedAtDesc(Task task);
    
    // Buscar entregas pendientes de calificar por profesor
    @Query("SELECT ts FROM TaskSubmission ts WHERE ts.task.teacher = :teacher AND ts.status = 'SUBMITTED'")
    List<TaskSubmission> findPendingGradingByTeacher(@Param("teacher") User teacher);
    
    // Contar entregas por estado
    @Query("SELECT COUNT(ts) FROM TaskSubmission ts WHERE ts.student = :student AND ts.status = :status")
    Long countByStudentAndStatus(@Param("student") User student, @Param("status") TaskSubmission.SubmissionStatus status);
}