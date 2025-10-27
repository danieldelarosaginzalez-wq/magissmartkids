package com.altiusacademy.repository.mysql;

import com.altiusacademy.model.entity.Activity;
import com.altiusacademy.model.entity.SchoolGrade;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ActivityRepository extends JpaRepository<Activity, Long> {
    
    List<Activity> findByInstitutionIdAndIsActiveTrue(Long institutionId);
    
    List<Activity> findByTeacherIdAndIsActiveTrue(Long teacherId);
    
    @Query("SELECT a FROM Activity a WHERE a.institution.id = ?1 AND a.isActive = true AND (a.schoolGrade IS NULL OR a.schoolGrade.id = ?2)")
    List<Activity> findByInstitutionAndGrade(Long institutionId, Long schoolGradeId);
    
    List<Activity> findByTypeAndIsActiveTrue(String type);
}
