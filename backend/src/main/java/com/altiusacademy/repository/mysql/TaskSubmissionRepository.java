package com.altiusacademy.repository.mysql;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.altiusacademy.model.entity.TaskSubmission;

@Repository
public interface TaskSubmissionRepository extends JpaRepository<TaskSubmission, Long> {
    
    // Buscar entrega específica de un estudiante para una tarea
    Optional<TaskSubmission> findByTaskIdAndStudentId(Long taskId, Long studentId);
    
    // Buscar todas las entregas de un estudiante
    List<TaskSubmission> findByStudentId(Long studentId);
    
    // Buscar todas las entregas de una tarea
    List<TaskSubmission> findByTaskId(Long taskId);
    
    // Verificar si un estudiante ya entregó una tarea
    boolean existsByTaskIdAndStudentId(Long taskId, Long studentId);
    
    // Contar entregas de una tarea
    @Query("SELECT COUNT(ts) FROM TaskSubmission ts WHERE ts.task.id = :taskId")
    long countSubmissionsByTaskId(@Param("taskId") Long taskId);
    
    // Buscar entregas pendientes de calificación
    @Query("SELECT ts FROM TaskSubmission ts WHERE ts.status = 'SUBMITTED' AND ts.task.teacher.id = :teacherId")
    List<TaskSubmission> findPendingSubmissionsByTeacher(@Param("teacherId") Long teacherId);
    
    // Buscar entregas por lista de IDs de tareas
    List<TaskSubmission> findByTaskIdIn(List<Long> taskIds);
    
    // Buscar entregas por estudiante y estado
    List<TaskSubmission> findByStudentIdAndStatus(Long studentId, TaskSubmission.SubmissionStatus status);
    
    // Calcular promedio de un estudiante
    @Query(value = "SELECT AVG(score) FROM task_submissions WHERE student_id = :studentId AND score IS NOT NULL", nativeQuery = true)
    Double getAverageScoreByStudent(@Param("studentId") Long studentId);
    
    // Contar tareas completadas (calificadas) de un estudiante
    @Query(value = "SELECT COUNT(*) FROM task_submissions WHERE student_id = :studentId AND status = 'GRADED'", nativeQuery = true)
    Long countCompletedTasksByStudent(@Param("studentId") Long studentId);
    
    // Contar tareas pendientes de un estudiante  
    @Query(value = "SELECT COUNT(*) FROM task_submissions WHERE student_id = :studentId AND status = 'SUBMITTED'", nativeQuery = true)
    Long countPendingTasksByStudent(@Param("studentId") Long studentId);
}
