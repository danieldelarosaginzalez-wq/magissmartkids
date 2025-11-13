package com.altiusacademy.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.altiusacademy.model.entity.Institution;
import com.altiusacademy.model.entity.User;
import com.altiusacademy.model.entity.UserInstitutionRole;
import com.altiusacademy.model.enums.UserRole;
import com.altiusacademy.repository.mysql.InstitutionRepository;
import com.altiusacademy.repository.mysql.UserInstitutionRoleRepository;
import com.altiusacademy.repository.mysql.UserRepository;

@Service
@Transactional
public class InstitutionService {

    @Autowired private InstitutionRepository institutionRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private UserInstitutionRoleRepository userInstitutionRoleRepository;

    /**
     * Obtener todas las instituciones
     */
    public List<Institution> findAllInstitutions() {
        return institutionRepository.findAll();
    }

    /**
     * Guardar institución
     */
    public Institution saveInstitution(Institution institution) {
        return institutionRepository.save(institution);
    }

    /**
     * Buscar institución por ID
     */
    public Institution findInstitutionById(Long id) {
        Optional<Institution> institution = institutionRepository.findById(id);
        return institution.orElse(null);
    }

    /**
     * Eliminar institución por ID
     */
    public void deleteInstitution(Long id) {
        institutionRepository.deleteById(id);
    }

    /**
     * Verificar si existe una institución con ese NIT
     */
    public boolean existsByNit(String nit) {
        return institutionRepository.existsByNit(nit);
    }

    /**
     * Verificar si existe una institución con ese nombre (case insensitive)
     */
    public boolean existsByNameIgnoreCase(String name) {
        return institutionRepository.existsByNameIgnoreCase(name);
    }

    /**
     * Buscar institución por NIT
     */
    public Institution findByNit(String nit) {
        Optional<Institution> institution = institutionRepository.findByNit(nit);
        return institution.orElse(null);
    }

    /**
     * Obtener estadísticas completas de una institución
     */
    public Map<String, Object> getInstitutionStats(Long institutionId) {
        System.out.println(" Obteniendo estadísticas para institución: " + institutionId);
        
        Map<String, Object> stats = new HashMap<>();
        
        try {
            Optional<Institution> institutionOpt = institutionRepository.findById(institutionId);
            if (institutionOpt.isEmpty()) {
                throw new RuntimeException("Institución no encontrada");
            }
            
            Institution institution = institutionOpt.get();
            
            // Contar usuarios por rol
            long teachers = userRepository.countByInstitutionAndRole(institutionId, UserRole.TEACHER);
            long students = userRepository.countByInstitutionAndRole(institutionId, UserRole.STUDENT);
            long coordinators = userRepository.countByInstitutionAndRole(institutionId, UserRole.COORDINATOR);
            
            stats.put("institution", institution);
            stats.put("teachers", teachers);
            stats.put("students", students);
            stats.put("coordinators", coordinators);
            stats.put("totalUsers", teachers + students + coordinators);
            
            System.out.println("✅ Estadísticas calculadas: " + stats);
            return stats;
            
        } catch (Exception e) {
            System.err.println("❌ Error calculando estadísticas: " + e.getMessage());
            throw new RuntimeException("Error al calcular estadísticas: " + e.getMessage());
        }
    }

    /**
     * Obtener todos los usuarios de una institución agrupados por rol
     */
    public Map<String, Object> getInstitutionUsers(Long institutionId) {
        System.out.println("👥 Obteniendo usuarios para institución: " + institutionId);
        
        Map<String, Object> users = new HashMap<>();
        
        try {
            List<User> teachers = userRepository.findTeachersByInstitution(institutionId, UserRole.TEACHER);
            List<User> students = userRepository.findStudentsByInstitution(institutionId, UserRole.STUDENT);
            List<User> coordinators = userRepository.findCoordinatorsByInstitution(institutionId, UserRole.COORDINATOR);
            
            users.put("teachers", teachers);
            users.put("students", students);
            users.put("coordinators", coordinators);
            users.put("totalTeachers", teachers.size());
            users.put("totalStudents", students.size());
            users.put("totalCoordinators", coordinators.size());
            
            System.out.println("✅ Usuarios obtenidos - Profesores: " + teachers.size() + 
                             ", Estudiantes: " + students.size() + 
                             ", Coordinadores: " + coordinators.size());
            
            return users;
            
        } catch (Exception e) {
            System.err.println("❌ Error obteniendo usuarios: " + e.getMessage());
            throw new RuntimeException("Error al obtener usuarios: " + e.getMessage());
        }
    }

    /**
     * Asignar usuario a institución con rol específico
     */
    public UserInstitutionRole assignUserToInstitution(Long userId, Long institutionId, String role) {
        System.out.println("🔗 Asignando usuario " + userId + " a institución " + institutionId + " con rol " + role);
        
        try {
            Optional<User> userOpt = userRepository.findById(userId);
            Optional<Institution> institutionOpt = institutionRepository.findById(institutionId);
            
            if (userOpt.isEmpty()) {
                throw new RuntimeException("Usuario no encontrado");
            }
            if (institutionOpt.isEmpty()) {
                throw new RuntimeException("Institución no encontrada");
            }
            
            User user = userOpt.get();
            Institution institution = institutionOpt.get();
            
            // Verificar si ya existe la relación
            Optional<UserInstitutionRole> existingRole = userInstitutionRoleRepository
                .findByUserIdAndInstitutionIdAndRole(userId, institutionId, role);
            
            if (existingRole.isPresent()) {
                UserInstitutionRole existing = existingRole.get();
                existing.setActive(true);
                return userInstitutionRoleRepository.save(existing);
            }
            
            // Crear nueva relación
            UserInstitutionRole newRole = new UserInstitutionRole(user, institution, role);
            UserInstitutionRole saved = userInstitutionRoleRepository.save(newRole);
            
            System.out.println("✅ Usuario asignado exitosamente");
            return saved;
            
        } catch (Exception e) {
            System.err.println("❌ Error asignando usuario: " + e.getMessage());
            throw new RuntimeException("Error al asignar usuario: " + e.getMessage());
        }
    }

    /**
     * Obtener instituciones donde un usuario tiene roles activos
     */
    public List<UserInstitutionRole> getUserInstitutions(Long userId) {
        System.out.println("🏛️ Obteniendo instituciones para usuario: " + userId);
        
        try {
            List<UserInstitutionRole> roles = userInstitutionRoleRepository.findByUserIdAndActiveTrue(userId);
            System.out.println("✅ Usuario tiene " + roles.size() + " roles activos");
            return roles;
            
        } catch (Exception e) {
            System.err.println("❌ Error obteniendo instituciones del usuario: " + e.getMessage());
            throw new RuntimeException("Error al obtener instituciones: " + e.getMessage());
        }
    }

    /**
     * Cambiar institución principal del usuario
     */
    public User changeUserPrimaryInstitution(Long userId, Long institutionId) {
        System.out.println("🔄 Cambiando institución principal del usuario " + userId + " a " + institutionId);
        
        try {
            Optional<User> userOpt = userRepository.findById(userId);
            Optional<Institution> institutionOpt = institutionRepository.findById(institutionId);
            
            if (userOpt.isEmpty()) {
                throw new RuntimeException("Usuario no encontrado");
            }
            if (institutionOpt.isEmpty()) {
                throw new RuntimeException("Institución no encontrada");
            }
            
            User user = userOpt.get();
            Institution institution = institutionOpt.get();
            
            user.setInstitution(institution);
            User saved = userRepository.save(user);
            
            System.out.println("✅ Institución principal cambiada exitosamente");
            return saved;
            
        } catch (Exception e) {
            System.err.println("❌ Error cambiando institución principal: " + e.getMessage());
            throw new RuntimeException("Error al cambiar institución: " + e.getMessage());
        }
    }

    /**
     * Verificar si un usuario pertenece a una institución
     */
    public boolean userBelongsToInstitution(Long userId, Long institutionId) {
        try {
            Optional<User> userOpt = userRepository.findById(userId);
            if (userOpt.isEmpty()) {
                return false;
            }
            
            User user = userOpt.get();
            
            // Verificar institución principal
            if (user.getInstitution() != null && user.getInstitution().getId().equals(institutionId)) {
                return true;
            }
            
            // Verificar roles adicionales
            List<UserInstitutionRole> roles = userInstitutionRoleRepository
                .findByUserIdAndInstitutionIdAndActiveTrue(userId, institutionId);
            
            return !roles.isEmpty();
            
        } catch (Exception e) {
            System.err.println("❌ Error verificando pertenencia: " + e.getMessage());
            return false;
        }
    }
}