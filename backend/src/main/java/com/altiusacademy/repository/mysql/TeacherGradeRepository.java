package com.altiusacademy.repository.mysql;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.altiusacademy.model.entity.TeacherGrade;

@Repository
public interface TeacherGradeRepository extends JpaRepository<TeacherGrade, Long> {
    
    // Buscar todos los grados de un profesor
    List<TeacherGrade> findByTeacherIdAndIsActiveTrue(Long teacherId);
    
    // Buscar por profesor e institución
    List<TeacherGrade> findByTeacherIdAndInstitutionIdAndIsActiveTrue(Long teacherId, Long institutionId);
    
    // Buscar por grado y sección específica
    Optional<TeacherGrade> findByGradeLevelAndSectionAndInstitutionIdAndIsActiveTrue(
        Integer gradeLevel, String section, Long institutionId);
    
    // Buscar todos los profesores de un grado específico
    List<TeacherGrade> findByGradeLevelAndInstitutionIdAndIsActiveTrue(Integer gradeLevel, Long institutionId);
    
    // Verificar si un profesor ya tiene asignado un grado específico
    boolean existsByTeacherIdAndGradeLevelAndSectionAndIsActiveTrue(
        Long teacherId, Integer gradeLevel, String section);
    
    // Buscar por año académico
    List<TeacherGrade> findByAcademicYearAndInstitutionIdAndIsActiveTrue(String academicYear, Long institutionId);
    
    // Query personalizada para obtener grados con información del profesor
    @Query("SELECT tg FROM TeacherGrade tg " +
           "JOIN FETCH tg.teacher t " +
           "WHERE tg.institution.id = :institutionId " +
           "AND tg.isActive = true " +
           "ORDER BY tg.gradeLevel, tg.section")
    List<TeacherGrade> findAllByInstitutionWithTeacher(@Param("institutionId") Long institutionId);
}
