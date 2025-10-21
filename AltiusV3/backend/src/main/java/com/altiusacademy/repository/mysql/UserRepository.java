package com.altiusacademy.repository.mysql;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.altiusacademy.model.entity.User;
import com.altiusacademy.model.enums.UserRole;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    List<User> findByRole(UserRole role);

    List<User> findByIsActiveTrue();

    @Query("SELECT u FROM User u WHERE u.firstName LIKE %?1% OR u.lastName LIKE %?1%")
    List<User> findByNameContaining(String name);

    boolean existsByEmail(String email);

    long countByRole(UserRole role);
    
    // Métodos para gestión multiinstitución
    @Query("SELECT u FROM User u WHERE u.institution.id = ?1 AND u.role = ?2 AND u.isActive = true")
    List<User> findByInstitutionIdAndRoleEnum(Long institutionId, UserRole role);
    
    // Métodos para gestión de grados académicos
    @Query("SELECT u FROM User u WHERE u.academicGrade.id = ?1 AND u.role = ?2 AND u.isActive = true")
    List<User> findByAcademicGradeAndRole(com.altiusacademy.model.entity.AcademicGrade academicGrade, UserRole role);
    
    @Query("SELECT u FROM User u WHERE u.institution.id = ?1 AND u.isActive = true")
    List<User> findByInstitutionId(Long institutionId);
    
    @Query("SELECT u FROM User u WHERE u.institution.id = ?1 AND u.role = ?2 AND u.isActive = true")
    List<User> findTeachersByInstitution(Long institutionId, UserRole role);
    
    @Query("SELECT u FROM User u WHERE u.institution.id = ?1 AND u.role = ?2 AND u.isActive = true")
    List<User> findStudentsByInstitution(Long institutionId, UserRole role);
    
    @Query("SELECT u FROM User u WHERE u.institution.id = ?1 AND u.role = ?2 AND u.isActive = true")
    List<User> findCoordinatorsByInstitution(Long institutionId, UserRole role);
    
    @Query("SELECT DISTINCT u.institution FROM User u WHERE u.isActive = true")
    List<Object> findDistinctInstitutions();
    
    @Query("SELECT COUNT(u) FROM User u WHERE u.institution.id = ?1 AND u.role = ?2 AND u.isActive = true")
    long countByInstitutionAndRole(Long institutionId, UserRole role);
    
    // Método para encontrar estudiantes por grado
    @Query("SELECT u FROM User u JOIN u.schoolGrade sg WHERE sg.gradeName = :grade AND u.role = 'STUDENT' AND u.isActive = true")
    List<User> findStudentsByGrade(@Param("grade") String grade);
}
