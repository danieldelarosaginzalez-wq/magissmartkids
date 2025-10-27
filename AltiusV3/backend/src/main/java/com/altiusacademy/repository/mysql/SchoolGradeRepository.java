package com.altiusacademy.repository.mysql;

import com.altiusacademy.model.entity.SchoolGrade;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SchoolGradeRepository extends JpaRepository<SchoolGrade, Long> {
    
    // Buscar grados activos ordenados por nivel
    @Query("SELECT sg FROM SchoolGrade sg WHERE sg.isActive = true ORDER BY sg.gradeLevel, sg.gradeName")
    List<SchoolGrade> findByIsActiveTrueOrderByGradeLevel();
    
    // Buscar por nombre de grado
    Optional<SchoolGrade> findByGradeName(String gradeName);
    
    // Buscar por nivel de grado
    List<SchoolGrade> findByGradeLevel(Integer gradeLevel);
    
    // Verificar si existe por nombre
    boolean existsByGradeName(String gradeName);
    
    // Buscar grados activos por nivel
    @Query("SELECT sg FROM SchoolGrade sg WHERE sg.isActive = true AND sg.gradeLevel = ?1 ORDER BY sg.gradeName")
    List<SchoolGrade> findByIsActiveTrueAndGradeLevel(Integer gradeLevel);
}