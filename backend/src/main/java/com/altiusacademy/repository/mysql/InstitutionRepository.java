package com.altiusacademy.repository.mysql;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.altiusacademy.model.entity.Institution;

@Repository
public interface InstitutionRepository extends JpaRepository<Institution, Long> {
    
    /**
     * Buscar instituciones activas
     */
    List<Institution> findByIsActiveTrue();
    
    /**
     * Buscar institución por nombre (case insensitive)
     */
    Optional<Institution> findByNameIgnoreCase(String name);
    
    /**
     * Buscar instituciones por nombre que contenga el texto (para búsquedas)
     */
    @Query("SELECT i FROM Institution i WHERE i.name LIKE %?1% AND i.isActive = true")
    List<Institution> findByNameContainingAndIsActiveTrue(String name);
    
    /**
     * Contar instituciones activas
     */
    long countByIsActiveTrue();
    
    /**
     * Verificar si existe una institución con ese nombre
     */
    boolean existsByNameIgnoreCase(String name);
    
    /**
     * Buscar institución por NIT
     */
    Optional<Institution> findByNit(String nit);
    
    /**
     * Verificar si existe una institución con ese NIT
     */
    boolean existsByNit(String nit);
}
