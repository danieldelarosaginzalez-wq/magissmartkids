package com.altiusacademy.repository.mongodb;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import com.altiusacademy.model.document.ActivityAttempt;

/**
 * Repositorio MongoDB para intentos de actividades
 */
@Repository
public interface ActivityAttemptRepository extends MongoRepository<ActivityAttempt, String> {
    
    // Intentos por estudiante
    List<ActivityAttempt> findByStudentIdOrderByStartedAtDesc(Long studentId);
    
    // Intentos por actividad
    List<ActivityAttempt> findByActivityIdOrderByStartedAtDesc(String activityId);
    
    // Intentos por estudiante y actividad
    List<ActivityAttempt> findByStudentIdAndActivityIdOrderByAttemptNumberDesc(Long studentId, String activityId);
    
    // Último intento de un estudiante en una actividad
    Optional<ActivityAttempt> findFirstByStudentIdAndActivityIdOrderByAttemptNumberDesc(Long studentId, String activityId);
    
    // Intentos completados por estudiante
    List<ActivityAttempt> findByStudentIdAndStatusOrderByCompletedAtDesc(Long studentId, ActivityAttempt.AttemptStatus status);
    
    // Contar intentos por estudiante y actividad
    Long countByStudentIdAndActivityId(Long studentId, String activityId);
    
    // Intentos en progreso
    List<ActivityAttempt> findByStudentIdAndStatus(Long studentId, ActivityAttempt.AttemptStatus status);
    
    // Estadísticas de rendimiento
    @Query("{'studentId': ?0, 'status': 'COMPLETED'}")
    List<ActivityAttempt> findCompletedAttemptsByStudent(Long studentId);
    
    // Promedio de puntuación por estudiante
    @Query(value = "{'studentId': ?0, 'status': 'COMPLETED'}", fields = "{'score': 1, 'maxScore': 1}")
    List<ActivityAttempt> findScoresByStudent(Long studentId);
    
    // Intentos recientes
    List<ActivityAttempt> findByStudentIdAndStartedAtAfterOrderByStartedAtDesc(Long studentId, LocalDateTime since);
    
    // Actividades completadas por estudiante
    @Query("{'studentId': ?0, 'status': 'COMPLETED', 'passed': true}")
    List<ActivityAttempt> findPassedAttemptsByStudent(Long studentId);
    
    // Tiempo promedio por actividad
    @Query(value = "{'activityId': ?0, 'status': 'COMPLETED'}", fields = "{'timeSpentMinutes': 1}")
    List<ActivityAttempt> findTimeSpentByActivity(String activityId);
}