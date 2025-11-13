package com.altiusacademy.repository.mysql;

import com.altiusacademy.model.entity.Assignment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AssignmentRepository extends JpaRepository<Assignment, Long> {
    
    List<Assignment> findByTeacherId(Long teacherId);
    
    List<Assignment> findBySubjectId(Long subjectId);
    
    @Query("SELECT a FROM Assignment a WHERE a.subject.institution.id = :institutionId AND a.isActive = true")
    List<Assignment> findActiveAssignmentsByInstitution(@Param("institutionId") Long institutionId);
    
    @Query("SELECT a FROM Assignment a WHERE a.teacher.id = :teacherId AND a.isActive = true")
    List<Assignment> findActiveAssignmentsByTeacher(@Param("teacherId") Long teacherId);
    
    @Query("SELECT a FROM Assignment a WHERE a.isActive = true")
    List<Assignment> findAllActiveAssignments();
}
