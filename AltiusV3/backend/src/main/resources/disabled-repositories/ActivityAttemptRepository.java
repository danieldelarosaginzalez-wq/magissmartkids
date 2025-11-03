package com.altiusacademy.repository.mongodb;

import com.altiusacademy.model.document.ActivityAttempt;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ActivityAttemptRepository extends MongoRepository<ActivityAttempt, String> {
    
    // Attempts by student
    List<ActivityAttempt> findByStudentIdOrderByStartedAtDesc(Long studentId);
    
    // Attempts by activity
    List<ActivityAttempt> findByActivityIdOrderByStartedAtDesc(String activityId);
    
    // TEMPORALMENTE COMENTADO - MÉTODOS PROBLEMÁTICOS
    // List<ActivityAttempt> findByInstitutionNitOrderByStartedAtDesc(String institutionNit);
    // List<ActivityAttempt> findByIsCompletedOrderByCompletedAtDesc(Boolean isCompleted);
    // Long countByStudentId(Long studentId);
    // Long countByActivityId(String activityId);
    // Long countByInstitutionNit(String institutionNit);
    // Long countByIsCompleted(Boolean isCompleted);
    
    // TEMPORALMENTE COMENTADO - QUERIES PROBLEMÁTICAS
    // @Query("{'studentId': ?0, 'isCompleted': true}")
    // List<ActivityAttempt> findCompletedAttemptsByStudent(Long studentId);
    // @Query("{'isCompleted': true}")
    // List<ActivityAttempt> findRecentCompletedAttempts();
    
    // Average score by student
    @Query(value = "{'studentId': ?0, 'score': {$exists: true}}", fields = "{'score': 1}")
    List<ActivityAttempt> findScoredAttemptsByStudent(Long studentId);
}