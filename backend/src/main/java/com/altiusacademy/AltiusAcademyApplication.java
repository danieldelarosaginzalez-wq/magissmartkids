package com.altiusacademy;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.Bean;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.scheduling.annotation.EnableAsync;

import com.altiusacademy.model.entity.User;
import com.altiusacademy.model.enums.UserRole;
import com.altiusacademy.repository.mysql.UserRepository;

@SpringBootApplication
@EnableJpaAuditing
@EnableAsync
@EnableJpaRepositories(basePackages = "com.altiusacademy.repository.mysql")
@EntityScan(basePackages = "com.altiusacademy.model.entity")
@org.springframework.scheduling.annotation.EnableScheduling
public class AltiusAcademyApplication {

    public static void main(String[] args) {
        SpringApplication.run(AltiusAcademyApplication.class, args);
    }

    @Bean
    static CommandLineRunner initAdminUser(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            // Verificar si ya existe un super admin
            if (!userRepository.existsByEmail("admin@altiusacademy.com")) {
                User admin = new User();
                admin.setEmail("admin@altiusacademy.com");
                admin.setFirstName("Super");
                admin.setLastName("Admin");
                admin.setRole(UserRole.SUPER_ADMIN);
                admin.setIsActive(true);

                // Encriptar contraseña con BCrypt
                String rawPassword = "admin123";
                String encodedPassword = passwordEncoder.encode(rawPassword);
                admin.setPassword(encodedPassword);

                userRepository.save(admin);

                System.out.println("✅ Usuario SUPER_ADMIN creado exitosamente");
                System.out.println("� Eamail: admin@altiusacademy.com");
                System.out.println("�  Password: admin123");
                System.out.println("🔐 Password Hash (BCrypt): " + encodedPassword);
            } else {
                System.out.println("ℹ️ Usuario admin ya existe en la base de datos");
                // Actualizar el usuario existente a SUPER_ADMIN si es necesario
                userRepository.findByEmail("admin@altiusacademy.com").ifPresent(existingAdmin -> {
                    if (existingAdmin.getRole() != UserRole.SUPER_ADMIN) {
                        existingAdmin.setRole(UserRole.SUPER_ADMIN);
                        existingAdmin.setIsActive(true);
                        userRepository.save(existingAdmin);
                        System.out.println("✅ Usuario actualizado a SUPER_ADMIN");
                    }
                });
            }
        };
    }

}
