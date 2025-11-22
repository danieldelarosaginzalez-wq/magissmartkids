package com.altiusacademy.service;

import com.altiusacademy.model.entity.Institution;
import com.altiusacademy.model.entity.User;
import com.altiusacademy.model.enums.UserRole;
import com.altiusacademy.repository.mysql.InstitutionRepository;
import com.altiusacademy.repository.mysql.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class UserService {

    private final UserRepository userRepository;
    private final InstitutionRepository institutionRepository;

    public List<User> findAllUsers() {
        return userRepository.findAll();
    }

    public List<User> findUsersByInstitution(Long institutionId) {
        return userRepository.findByInstitutionId(institutionId);
    }

    public User saveUser(User user) {
        return userRepository.save(user);
    }

    public User findUserById(Long id) {
        Optional<User> user = userRepository.findById(id);
        return user.orElse(null);
    }

    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    public void assignUserToInstitution(Long userId, Long institutionId) {
        Optional<User> userOpt = userRepository.findById(userId);
        Optional<Institution> institutionOpt = institutionRepository.findById(institutionId);

        if (userOpt.isPresent() && institutionOpt.isPresent()) {
            User user = userOpt.get();
            Institution institution = institutionOpt.get();
            user.setInstitution(institution);
            userRepository.save(user);
        }
    }

    public void changeUserRole(Long userId, String newRole) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            user.setRole(UserRole.fromString(newRole));
            userRepository.save(user);
        }
    }

    public List<User> findStudentsByGrade(String grade) {
        return userRepository.findStudentsByGrade(grade);
    }
}
