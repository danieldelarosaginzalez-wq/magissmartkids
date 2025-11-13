package com.altiusacademy.repository.mysql;

import com.altiusacademy.model.entity.UserInstitutionRole;
import com.altiusacademy.model.entity.User;
import com.altiusacademy.model.entity.Institution;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserInstitutionRoleRepository extends JpaRepository<UserInstitutionRole, Long> {
    
    // Buscar por usuario, institución y rol
    Optional<UserInstitutionRole> findByUserAndInstitutionAndRole(User user, Institution institution, String role);
    
    // Buscar por usuario, institución y rol activo
    Optional<UserInstitutionRole> findByUserAndInstitutionAndRoleAndActiveTrue(User user, Institution institution, String role);
    
    // Buscar todas las instituciones de un usuario
    List<UserInstitutionRole> findByUserAndActiveTrue(User user);
    
    // Buscar todos los usuarios de una institución
    List<UserInstitutionRole> findByInstitutionAndActiveTrue(Institution institution);
    
    // Buscar usuarios por institución y rol
    List<UserInstitutionRole> findByInstitutionAndRoleAndActiveTrue(Institution institution, String role);
    
    // Buscar por ID de institución y rol
    @Query("SELECT uir FROM UserInstitutionRole uir WHERE uir.institution.id = :institutionId AND uir.role = :role AND uir.active = true")
    List<UserInstitutionRole> findByInstitutionIdAndRoleAndActiveTrue(@Param("institutionId") Long institutionId, @Param("role") String role);
    
    // Verificar si existe la relación
    boolean existsByUserAndInstitutionAndRoleAndActiveTrue(User user, Institution institution, String role);
    
    // Buscar por usuario e institución (cualquier rol)
    List<UserInstitutionRole> findByUserAndInstitutionAndActiveTrue(User user, Institution institution);
    
    // Métodos adicionales para consultas por ID
    @Query("SELECT uir FROM UserInstitutionRole uir WHERE uir.user.id = :userId AND uir.active = true")
    List<UserInstitutionRole> findByUserIdAndActiveTrue(@Param("userId") Long userId);
    
    @Query("SELECT uir FROM UserInstitutionRole uir WHERE uir.user.id = :userId AND uir.institution.id = :institutionId AND uir.role = :role")
    Optional<UserInstitutionRole> findByUserIdAndInstitutionIdAndRole(@Param("userId") Long userId, @Param("institutionId") Long institutionId, @Param("role") String role);
    
    @Query("SELECT uir FROM UserInstitutionRole uir WHERE uir.user.id = :userId AND uir.institution.id = :institutionId AND uir.active = true")
    List<UserInstitutionRole> findByUserIdAndInstitutionIdAndActiveTrue(@Param("userId") Long userId, @Param("institutionId") Long institutionId);
    
    @Query("SELECT COUNT(uir) FROM UserInstitutionRole uir WHERE uir.institution.id = :institutionId AND uir.role = :role AND uir.active = true")
    long countByInstitutionIdAndRoleAndActiveTrue(@Param("institutionId") Long institutionId, @Param("role") String role);
}
