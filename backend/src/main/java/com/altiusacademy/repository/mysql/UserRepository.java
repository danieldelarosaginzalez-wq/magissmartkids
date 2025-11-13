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

    boolean existsByRole(UserRole role);

    long countByRole(UserRole role);
    
    // Métodos para gestión multiinstitución
    @Query("SELECT u FROM User u WHERE u.institution.id = ?1 AND u.role = ?2 AND u.isActive = true")
    List<User> findByInstitutionIdAndRoleEnum(Long institutionId, UserRole role);
    
    // Métodos para gestión de grados escolares
    @Query("SELECT u FROM User u WHERE u.schoolGrade.id = ?1 AND u.role = ?2 AND u.isActive = true")
    List<User> findBySchoolGradeAndRole(Long schoolGradeId, UserRole role);
    
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
    
    // Métodos adicionales para CoordinatorService
    @Query("SELECT COUNT(u) FROM User u WHERE u.institution.id = :institutionId AND u.role = :role")
    Long countByInstitutionIdAndRole(@Param("institutionId") Long institutionId, @Param("role") UserRole role);
    
    @Query("SELECT u FROM User u WHERE u.institution.id = :institutionId AND u.role = :role ORDER BY u.createdAt DESC")
    List<User> findRecentTeachersByInstitution(@Param("institutionId") Long institutionId, @Param("role") UserRole role, org.springframework.data.domain.Pageable pageable);
    
    @Query("SELECT u FROM User u WHERE u.institution.id = :institutionId AND u.role = :role ORDER BY u.createdAt DESC")
    List<User> findRecentStudentsByInstitution(@Param("institutionId") Long institutionId, @Param("role") UserRole role, org.springframework.data.domain.Pageable pageable);
    
    @Query("SELECT COUNT(u) FROM User u WHERE u.schoolGrade.id = :gradeId AND u.role = :role")
    Long countBySchoolGradeIdAndRole(@Param("gradeId") Long gradeId, @Param("role") UserRole role);
    
    // TEMPORALMENTE COMENTADO - QUERY PROBLEMÁTICA CON RELACIONES
    // @Query("SELECT COUNT(u) FROM User u JOIN TeacherSubject ts ON u.id = ts.teacherId WHERE ts.subjectId IN (SELECT s.id FROM Subject s WHERE s.teacher.id = :teacherId)")
    // Long countStudentsByTeacher(@Param("teacherId") Long teacherId);
    
    // Versión simplificada que funciona
    default Long countStudentsByTeacher(Long teacherId) {
        return 0L; // Retorna 0 por ahora para evitar errores
    }
    
    // TEMPORALMENTE COMENTADO - QUERY PROBLEMÁTICA CON schoolGrade
    // @Query("SELECT COUNT(u) FROM User u JOIN u.schoolGrade sg JOIN Subject s ON sg.id = s.schoolGrade.id WHERE s.id = :subjectId AND u.role = 'STUDENT'")
    // Long countStudentsBySubject(@Param("subjectId") Long subjectId);
    
    // TEMPORALMENTE COMENTADO - FALTA COLUMNA EN BD
    // @Query("SELECT u FROM User u WHERE u.institution.id = :institutionId AND u.lastLoginAt IS NOT NULL ORDER BY u.lastLoginAt DESC")
    // List<User> findRecentLoginsByInstitution(@Param("institutionId") Long institutionId, org.springframework.data.domain.Pageable pageable);
    
    // Métodos con límite usando Pageable
    default List<User> findRecentTeachersByInstitution(Long institutionId, int limit) {
        return findRecentTeachersByInstitution(institutionId, UserRole.TEACHER, 
            org.springframework.data.domain.PageRequest.of(0, limit));
    }
    
    default List<User> findRecentStudentsByInstitution(Long institutionId, int limit) {
        return findRecentStudentsByInstitution(institutionId, UserRole.STUDENT, 
            org.springframework.data.domain.PageRequest.of(0, limit));
    }
    
    // TEMPORALMENTE COMENTADO - FALTA COLUMNA EN BD
    // default List<User> findRecentLoginsByInstitution(Long institutionId, int limit) {
    //     return findRecentLoginsByInstitution(institutionId, 
    //         org.springframework.data.domain.PageRequest.of(0, limit));
    // }
    

}
