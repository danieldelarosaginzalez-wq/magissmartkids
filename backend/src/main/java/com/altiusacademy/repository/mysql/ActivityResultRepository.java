package com.altiusacademy.repository.mysql;

import com.altiusacademy.model.entity.ActivityResult;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ActivityResultRepository extends JpaRepository<ActivityResult, Long> {
    
    List<ActivityResult> findByUserId(Long userId);
    
    List<ActivityResult> findByActivityId(Long activityId);
    
    Optional<ActivityResult> findByUserIdAndActivityId(Long userId, Long activityId);
    
    @Query("SELECT ar FROM ActivityResult ar WHERE ar.activity.teacher.id = ?1")
    List<ActivityResult> findByTeacherId(Long teacherId);
    
    @Query("SELECT ar FROM ActivityResult ar WHERE ar.activity.institution.id = ?1")
    List<ActivityResult> findByInstitutionId(Long institutionId);
}
