package com.altiusacademy.repository.mysql;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.altiusacademy.model.entity.SchoolGrade;

@Repository
public interface SchoolGradeRepository extends JpaRepository<SchoolGrade, Long> {
    
    // Encontrar grados activos ordenados por nivel
    @Query("SELECT sg FROM SchoolGrade sg WHERE sg.isActive = true ORDER BY sg.gradeLevel ASC")
    List<SchoolGrade> findActiveGradesOrderByLevel();
    
    // Encontrar por nombre de grado
    Optional<SchoolGrade> findByGradeName(String gradeName);
    
    // Encontrar por nivel de grado
    Optional<SchoolGrade> findByGradeLevel(Integer gradeLevel);
    
    // Encontrar grados activos
    List<SchoolGrade> findByIsActiveTrue();
    
    // Verificar si existe un grado por nombre
    boolean existsByGradeName(String gradeName);
}
