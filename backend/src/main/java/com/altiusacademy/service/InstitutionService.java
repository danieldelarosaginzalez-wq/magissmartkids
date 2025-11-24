package com.altiusacademy.service;

import com.altiusacademy.model.entity.Institution;
import com.altiusacademy.model.entity.User;
import com.altiusacademy.model.entity.UserInstitutionRole;
import com.altiusacademy.model.enums.UserRole;
import com.altiusacademy.repository.mysql.InstitutionRepository;
import com.altiusacademy.repository.mysql.UserInstitutionRoleRepository;
import com.altiusacademy.repository.mysql.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class InstitutionService {

    private final InstitutionRepository institutionRepository;
    private final UserRepository userRepository;
    private final UserInstitutionRoleRepository userInstitutionRoleRepository;

    public List<Institution> findAllInstitutions() {
        return institutionRepository.findAll();
    }

    public Institution findInstitutionById(Long id) {
        Optional<Institution> institution = institutionRepository.findById(id);
        return institution.orElse(null);
    }

    public Institution saveInstitution(Institution institution) {
        return institutionRepository.save(institution);
    }

    public void deleteInstitution(Long id) {
        institutionRepository.deleteById(id);
    }

    public List<Institution> findActiveInstitutions() {
        return institutionRepository.findByIsActiveTrue();
    }

    public Map<String, Object> getInstitutionStats(Long institutionId) {
        List<User> users = userRepository.findByInstitutionId(institutionId);

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalUsers", users.size());
        stats.put("totalStudents", users.stream().filter(u -> u.getRole() == UserRole.STUDENT).count());
        stats.put("totalTeachers", users.stream().filter(u -> u.getRole() == UserRole.TEACHER).count());
        stats.put("totalCoordinators", users.stream().filter(u -> u.getRole() == UserRole.COORDINATOR).count());

        return stats;
    }

    public Map<String, Object> getInstitutionUsers(Long institutionId) {
        List<User> users = userRepository.findByInstitutionId(institutionId);

        Map<String, Object> result = new HashMap<>();
        result.put("students", users.stream().filter(u -> u.getRole() == UserRole.STUDENT).toList());
        result.put("teachers", users.stream().filter(u -> u.getRole() == UserRole.TEACHER).toList());
        result.put("coordinators", users.stream().filter(u -> u.getRole() == UserRole.COORDINATOR).toList());
        result.put("total", users.size());

        return result;
    }

    public List<UserInstitutionRole> getUserInstitutions(Long userId) {
        return userInstitutionRoleRepository.findByUserId(userId);
    }

    public UserInstitutionRole assignUserToInstitution(Long userId, Long institutionId, String role) {
        User user = userRepository.findById(userId).orElseThrow();
        Institution institution = institutionRepository.findById(institutionId).orElseThrow();

        UserInstitutionRole assignment = new UserInstitutionRole();
        assignment.setUser(user);
        assignment.setInstitution(institution);
        assignment.setRole(role);

        return userInstitutionRoleRepository.save(assignment);
    }
}
