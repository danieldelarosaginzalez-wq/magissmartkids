package com.altiusacademy.service;

import com.altiusacademy.model.entity.UserInstitutionRole;
import com.altiusacademy.model.entity.User;
import com.altiusacademy.model.entity.Institution;
import com.altiusacademy.repository.mysql.UserInstitutionRoleRepository;
import com.altiusacademy.repository.mysql.UserRepository;
import com.altiusacademy.repository.mysql.InstitutionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class UserInstitutionRoleService {
    
    @Autowired
    private UserInstitutionRoleRepository userInstitutionRoleRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private InstitutionRepository institutionRepository;
    
    /**
     * Asignar un usuario a una institución con un rol específico
     */
    public UserInstitutionRole assignUserToInstitution(Long userId, Long institutionId, String role) {
        // Verificar que el usuario existe
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("Usuario no encontrado con ID: " + userId));
        
        // Verificar que la institución existe
        Institution institution = institutionRepository.findById(institutionId)
            .orElseThrow(() -> new RuntimeException("Institución no encontrada con ID: " + institutionId));
        
        // Verificar si ya existe esta asignación
        if (userInstitutionRoleRepository.existsByUserAndInstitutionAndRoleAndActiveTrue(user, institution, role)) {
            throw new RuntimeException("El usuario ya tiene el rol '" + role + "' en la institución '" + institution.getName() + "'");
        }
        
        // Crear la nueva asignación
        UserInstitutionRole userInstitutionRole = new UserInstitutionRole(user, institution, role);
        return userInstitutionRoleRepository.save(userInstitutionRole);
    }
    
    /**
     * Obtener todas las instituciones de un usuario
     */
    public List<UserInstitutionRole> getUserInstitutions(Long userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("Usuario no encontrado con ID: " + userId));
        
        return userInstitutionRoleRepository.findByUserAndActiveTrue(user);
    }
    
    /**
     * Obtener todos los usuarios de una institución
     */
    public List<UserInstitutionRole> getInstitutionUsers(Long institutionId) {
        Institution institution = institutionRepository.findById(institutionId)
            .orElseThrow(() -> new RuntimeException("Institución no encontrada con ID: " + institutionId));
        
        return userInstitutionRoleRepository.findByInstitutionAndActiveTrue(institution);
    }
    
    /**
     * Obtener usuarios por institución y rol
     */
    public List<UserInstitutionRole> getUsersByInstitutionAndRole(Long institutionId, String role) {
        return userInstitutionRoleRepository.findByInstitutionIdAndRoleAndActiveTrue(institutionId, role);
    }
    
    /**
     * Desactivar una asignación usuario-institución-rol
     */
    public void deactivateUserInstitutionRole(Long userId, Long institutionId, String role) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("Usuario no encontrado con ID: " + userId));
        
        Institution institution = institutionRepository.findById(institutionId)
            .orElseThrow(() -> new RuntimeException("Institución no encontrada con ID: " + institutionId));
        
        Optional<UserInstitutionRole> userInstitutionRole = 
            userInstitutionRoleRepository.findByUserAndInstitutionAndRoleAndActiveTrue(user, institution, role);
        
        if (userInstitutionRole.isPresent()) {
            UserInstitutionRole uir = userInstitutionRole.get();
            uir.setActive(false);
            userInstitutionRoleRepository.save(uir);
        } else {
            throw new RuntimeException("No se encontró la asignación activa para desactivar");
        }
    }
    
    /**
     * Verificar si un usuario tiene un rol específico en una institución
     */
    public boolean hasUserRoleInInstitution(Long userId, Long institutionId, String role) {
        User user = userRepository.findById(userId).orElse(null);
        Institution institution = institutionRepository.findById(institutionId).orElse(null);
        
        if (user == null || institution == null) {
            return false;
        }
        
        return userInstitutionRoleRepository.existsByUserAndInstitutionAndRoleAndActiveTrue(user, institution, role);
    }
}