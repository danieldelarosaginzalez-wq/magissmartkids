package com.altiusacademy.repository.mysql;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.altiusacademy.model.entity.ParentStudentRelation;
import com.altiusacademy.model.entity.User;

@Repository
public interface ParentStudentRelationRepository extends JpaRepository<ParentStudentRelation, Long> {
    
    // Encontrar relaciones por padre
    List<ParentStudentRelation> findByParentAndIsActiveTrue(User parent);
    
    // Encontrar relaciones por estudiante
    List<ParentStudentRelation> findByStudentAndIsActiveTrue(User student);
    
    // Verificar si existe una relación específica
    Optional<ParentStudentRelation> findByParentAndStudentAndIsActiveTrue(User parent, User student);
    
    // Verificar si ya existe una relación (activa o inactiva)
    boolean existsByParentAndStudent(User parent, User student);
    
    // Obtener todos los hijos de un padre
    @Query("SELECT psr.student FROM ParentStudentRelation psr WHERE psr.parent = :parent AND psr.isActive = true")
    List<User> findActiveStudentsByParent(@Param("parent") User parent);
    
    // Obtener todos los padres de un estudiante
    @Query("SELECT psr.parent FROM ParentStudentRelation psr WHERE psr.student = :student AND psr.isActive = true")
    List<User> findActiveParentsByStudent(@Param("student") User student);
    
    // Contar hijos activos de un padre
    @Query("SELECT COUNT(psr) FROM ParentStudentRelation psr WHERE psr.parent = :parent AND psr.isActive = true")
    Long countActiveStudentsByParent(@Param("parent") User parent);
    
    // Contar padres activos de un estudiante
    @Query("SELECT COUNT(psr) FROM ParentStudentRelation psr WHERE psr.student = :student AND psr.isActive = true")
    Long countActiveParentsByStudent(@Param("student") User student);
}
