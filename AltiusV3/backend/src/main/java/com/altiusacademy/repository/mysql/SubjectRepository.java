package com.altiusacademy.repository.mysql;

import com.altiusacademy.model.entity.Subject;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SubjectRepository extends JpaRepository<Subject, Long> {
    
    List<Subject> findByInstitutionId(Long institutionId);
    
    List<Subject> findByTeacherId(Long teacherId);
    
    List<Subject> findByInstitutionIdAndIsActive(Long institutionId, Boolean isActive);
    
    @Query("SELECT s FROM Subject s WHERE s.institution.id = :institutionId AND s.isActive = true")
    List<Subject> findActiveSubjectsByInstitution(@Param("institutionId") Long institutionId);
    
    @Query("SELECT s FROM Subject s WHERE s.teacher.id = :teacherId AND s.isActive = true")
    List<Subject> findActiveSubjectsByTeacher(@Param("teacherId") Long teacherId);
    
    // Métodos adicionales para CoordinatorService
    @Query("SELECT COUNT(s) FROM Subject s WHERE s.institution.id = :institutionId")
    Long countByInstitutionId(@Param("institutionId") Long institutionId);
    
    // Method for StudentService
    @Query("SELECT s FROM Subject s JOIN s.schoolGrade sg WHERE sg.gradeName = :grade")
    List<Subject> findByGrade(@Param("grade") String grade);
}
