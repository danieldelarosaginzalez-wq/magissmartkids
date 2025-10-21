package com.altiusacademy.repository.mongodb;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import com.altiusacademy.model.document.InteractiveActivity;

/**
 * Repositorio MongoDB para actividades interactivas
 */
@Repository
public interface InteractiveActivityRepository extends MongoRepository<InteractiveActivity, String> {
    
    // Actividades por profesor
    List<InteractiveActivity> findByTeacherIdAndIsActiveOrderByCreatedAtDesc(Long teacherId, Boolean isActive);
    
    // Actividades por materia
    List<InteractiveActivity> findBySubjectIdAndIsActiveOrderByCreatedAtDesc(Long subjectId, Boolean isActive);
    
    // Actividades por institución
    List<InteractiveActivity> findByInstitutionIdAndIsActiveOrderByCreatedAtDesc(Long institutionId, Boolean isActive);
    
    // Actividades por grado académico
    List<InteractiveActivity> findByAcademicGradeIdAndIsActiveOrderByCreatedAtDesc(Long academicGradeId, Boolean isActive);
    
    // Actividades por tipo
    List<InteractiveActivity> findByActivityTypeAndIsActiveOrderByCreatedAtDesc(InteractiveActivity.ActivityType activityType, Boolean isActive);
    
    // Actividades por dificultad
    List<InteractiveActivity> findByDifficultyLevelAndIsActiveOrderByCreatedAtDesc(InteractiveActivity.DifficultyLevel difficultyLevel, Boolean isActive);
    
    // Buscar por título
    @Query("{'title': {$regex: ?0, $options: 'i'}, 'isActive': true}")
    List<InteractiveActivity> findByTitleContainingIgnoreCase(String title);
    
    // Buscar por tags
    @Query("{'tags': {$in: ?0}, 'isActive': true}")
    List<InteractiveActivity> findByTagsIn(List<String> tags);
    
    // Actividades para un estudiante específico (por grado e institución)
    @Query("{'institutionId': ?0, 'academicGradeId': ?1, 'isActive': true}")
    List<InteractiveActivity> findActivitiesForStudent(Long institutionId, Long academicGradeId);
    
    // Contar actividades por profesor
    Long countByTeacherIdAndIsActive(Long teacherId, Boolean isActive);
    
    // Actividades recientes
    @Query("{'isActive': true}")
    List<InteractiveActivity> findRecentActivities();
}