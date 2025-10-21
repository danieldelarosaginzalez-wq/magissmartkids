package com.altiusacademy.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.altiusacademy.model.entity.ParentChildRelation;
import com.altiusacademy.model.entity.User;
import com.altiusacademy.model.enums.UserRole;
import com.altiusacademy.repository.mysql.ParentChildRelationRepository;
import com.altiusacademy.repository.mysql.UserRepository;

@Service
@Transactional
public class ParentChildService {

    @Autowired
    private ParentChildRelationRepository parentChildRelationRepository;

    @Autowired
    private UserRepository userRepository;

    /**
     * Crear relación padre-hijo
     */
    public ParentChildRelation createParentChildRelation(Long parentId, Long childId) {
        // Verificar que el padre existe y es un padre
        Optional<User> parentOpt = userRepository.findById(parentId);
        if (parentOpt.isEmpty() || parentOpt.get().getRole() != UserRole.PARENT) {
            throw new IllegalArgumentException("El usuario padre no existe o no tiene rol de padre");
        }

        // Verificar que el hijo existe y es un estudiante
        Optional<User> childOpt = userRepository.findById(childId);
        if (childOpt.isEmpty() || childOpt.get().getRole() != UserRole.STUDENT) {
            throw new IllegalArgumentException("El usuario hijo no existe o no tiene rol de estudiante");
        }

        // Verificar si ya existe la relación
        if (parentChildRelationRepository.existsByParentIdAndChildId(parentId, childId)) {
            // Si existe pero está inactiva, reactivarla
            Optional<ParentChildRelation> existingRelation = parentChildRelationRepository
                    .findByParentIdAndChildIdAndIsActiveTrue(parentId, childId);

            if (existingRelation.isPresent()) {
                return existingRelation.get(); // Ya existe y está activa
            } else {
                // Buscar la relación inactiva y reactivarla
                List<ParentChildRelation> allRelations = parentChildRelationRepository.findAll();
                Optional<ParentChildRelation> inactiveRelation = allRelations.stream()
                        .filter(r -> r.getParentId().equals(parentId) && r.getChildId().equals(childId))
                        .findFirst();

                if (inactiveRelation.isPresent()) {
                    ParentChildRelation relation = inactiveRelation.get();
                    relation.setIsActive(true);
                    relation.setUpdatedAt(java.time.LocalDateTime.now());
                    return parentChildRelationRepository.save(relation);
                }
            }
        }

        // Crear nueva relación
        ParentChildRelation newRelation = new ParentChildRelation(parentId, childId);
        return parentChildRelationRepository.save(newRelation);
    }

    /**
     * Crear múltiples relaciones padre-hijo por correos de estudiantes
     */
    public List<ParentChildRelation> createParentChildRelationsByEmails(Long parentId, List<String> childrenEmails) {
        return childrenEmails.stream()
                .map(email -> {
                    Optional<User> childOpt = userRepository.findByEmail(email);
                    if (childOpt.isEmpty()) {
                        throw new IllegalArgumentException("No se encontró estudiante con email: " + email);
                    }

                    User child = childOpt.get();
                    if (child.getRole() != UserRole.STUDENT) {
                        throw new IllegalArgumentException("El usuario con email " + email + " no es un estudiante");
                    }

                    return createParentChildRelation(parentId, child.getId());
                })
                .collect(Collectors.toList());
    }

    /**
     * Obtener hijos de un padre
     */
    public List<User> getChildrenByParentId(Long parentId) {
        List<ParentChildRelation> relations = parentChildRelationRepository.findByParentIdAndIsActiveTrue(parentId);

        return relations.stream()
                .map(relation -> userRepository.findById(relation.getChildId()))
                .filter(Optional::isPresent)
                .map(Optional::get)
                .collect(Collectors.toList());
    }

    /**
     * Obtener padres de un hijo
     */
    public List<User> getParentsByChildId(Long childId) {
        List<ParentChildRelation> relations = parentChildRelationRepository.findByChildIdAndIsActiveTrue(childId);

        return relations.stream()
                .map(relation -> userRepository.findById(relation.getParentId()))
                .filter(Optional::isPresent)
                .map(Optional::get)
                .collect(Collectors.toList());
    }

    /**
     * Verificar si un usuario es padre de otro
     */
    public boolean isParentOf(Long parentId, Long childId) {
        return parentChildRelationRepository.findByParentIdAndChildIdAndIsActiveTrue(parentId, childId).isPresent();
    }

    /**
     * Desactivar relación padre-hijo
     */
    public void deactivateParentChildRelation(Long parentId, Long childId) {
        Optional<ParentChildRelation> relationOpt = parentChildRelationRepository
                .findByParentIdAndChildIdAndIsActiveTrue(parentId, childId);

        if (relationOpt.isPresent()) {
            ParentChildRelation relation = relationOpt.get();
            relation.setIsActive(false);
            relation.setUpdatedAt(java.time.LocalDateTime.now());
            parentChildRelationRepository.save(relation);
        }
    }

    /**
     * Obtener estadísticas de relaciones
     */
    public Long countChildrenByParentId(Long parentId) {
        return parentChildRelationRepository.countActiveChildrenByParentId(parentId);
    }

    public Long countParentsByChildId(Long childId) {
        return parentChildRelationRepository.countActiveParentsByChildId(childId);
    }

    /**
     * Validar que todos los correos corresponden a estudiantes registrados
     */
    public boolean validateStudentEmails(List<String> emails) {
        for (String email : emails) {
            Optional<User> userOpt = userRepository.findByEmail(email);
            if (userOpt.isEmpty() || userOpt.get().getRole() != UserRole.STUDENT) {
                return false;
            }
        }
        return true;
    }

    /**
     * Obtener información detallada de estudiantes por correos
     */
    public List<User> getStudentsByEmails(List<String> emails) {
        return emails.stream()
                .map(email -> userRepository.findByEmail(email))
                .filter(Optional::isPresent)
                .map(Optional::get)
                .filter(user -> user.getRole() == UserRole.STUDENT)
                .collect(Collectors.toList());
    }
}