package com.altiusacademy.util;

import com.altiusacademy.model.entity.User;
import com.altiusacademy.model.enums.UserRole;
import com.altiusacademy.repository.mysql.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

/**
 * Utilidad para crear usuarios administradores iniciales
 * Se ejecuta automáticamente al iniciar la aplicación
 */
@Component
public class CreateAdminUsers implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        createAdminIfNotExists("admin1", "admin1@magicsmartkids.com", "Administrador", "Principal");
        createAdminIfNotExists("admin2", "admin2@magicsmartkids.com", "Administrador", "Secundario");
    }

    private void createAdminIfNotExists(String username, String email, String firstName, String lastName) {
        if (!userRepository.existsByUsername(username)) {
            User admin = new User();
            admin.setUsername(username);
            admin.setEmail(email);
            admin.setPassword(passwordEncoder.encode("Admin123!"));
            admin.setFirstName(firstName);
            admin.setLastName(lastName);
            admin.setRole(UserRole.SUPER_ADMIN);
            admin.setActive(true);
            admin.setCreatedAt(LocalDateTime.now());
            admin.setUpdatedAt(LocalDateTime.now());

            userRepository.save(admin);
            System.out.println("✓ Usuario administrador creado: " + username);
        } else {
            System.out.println("→ Usuario administrador ya existe: " + username);
        }
    }
}
