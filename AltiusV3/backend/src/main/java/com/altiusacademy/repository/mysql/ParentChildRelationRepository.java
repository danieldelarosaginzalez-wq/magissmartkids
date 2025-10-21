package com.altiusacademy.repository.mysql;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.altiusacademy.model.entity.ParentChildRelation;

@Repository
public interface ParentChildRelationRepository extends JpaRepository<ParentChildRelation, Long> {
    
    // Encontrar relaciones por padre
    List<ParentChildRelation> findByParentIdAndIsActiveTrue(Long parentId);
    
    // Encontrar relaciones por hijo
    List<ParentChildRelation> findByChildIdAndIsActiveTrue(Long childId);
    
    // Verificar si existe una relación específica
    Optional<ParentChildRelation> findByParentIdAndChildIdAndIsActiveTrue(Long parentId, Long childId);
    
    // Verificar si ya existe una relación (activa o inactiva)
    boolean existsByParentIdAndChildId(Long parentId, Long childId);
    
    // Obtener todos los hijos de un padre con información del usuario
    @Query("SELECT pcr FROM ParentChildRelation pcr WHERE pcr.parentId = :parentId AND pcr.isActive = true")
    List<ParentChildRelation> findActiveChildrenByParentId(@Param("parentId") Long parentId);
    
    // Obtener todos los padres de un hijo con información del usuario
    @Query("SELECT pcr FROM ParentChildRelation pcr WHERE pcr.childId = :childId AND pcr.isActive = true")
    List<ParentChildRelation> findActiveParentsByChildId(@Param("childId") Long childId);
    
    // Contar hijos activos de un padre
    @Query("SELECT COUNT(pcr) FROM ParentChildRelation pcr WHERE pcr.parentId = :parentId AND pcr.isActive = true")
    Long countActiveChildrenByParentId(@Param("parentId") Long parentId);
    
    // Contar padres activos de un hijo
    @Query("SELECT COUNT(pcr) FROM ParentChildRelation pcr WHERE pcr.childId = :childId AND pcr.isActive = true")
    Long countActiveParentsByChildId(@Param("childId") Long childId);
}
