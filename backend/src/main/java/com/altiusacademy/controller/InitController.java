package com.altiusacademy.controller;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.altiusacademy.model.entity.Institution;
import com.altiusacademy.model.entity.User;
import com.altiusacademy.repository.mysql.InstitutionRepository;
import com.altiusacademy.repository.mysql.UserRepository;

/**
 * Controlador para inicialización y configuración del sistema
 * SOLO PARA DESARROLLO - Deshabilitar en producción
 */
@RestController
@RequestMapping("/api/init")
public class InitController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private InstitutionRepository institutionRepository;

    @PersistenceContext
    private EntityManager entityManager;

    /**
     * Asignar todos los usuarios sin institución a la institución con ID 1
     */
    @PostMapping("/assign-users-to-institution")
    public ResponseEntity<?> assignUsersToDefaultInstitution() {
        try {
            System.out.println("🔧 Iniciando asignación de usuarios a institución por defecto...");

            // Buscar la institución con ID 1
            Optional<Institution> institutionOpt = institutionRepository.findById(1L);
            if (institutionOpt.isEmpty()) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "No se encontró la institución con ID 1");
                return ResponseEntity.badRequest().body(response);
            }

            Institution institution = institutionOpt.get();
            System.out.println("✅ Institución encontrada: " + institution.getName());

            // Buscar todos los usuarios
            List<User> allUsers = userRepository.findAll();
            int updated = 0;
            int skipped = 0;

            for (User user : allUsers) {
                if (user.getInstitution() == null) {
                    user.setInstitution(institution);
                    userRepository.save(user);
                    updated++;
                    System.out.println("✅ Usuario asignado: " + user.getEmail() + " -> " + institution.getName());
                } else {
                    skipped++;
                    System.out.println("⏭️ Usuario ya tiene institución: " + user.getEmail());
                }
            }

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Usuarios asignados exitosamente");
            response.put("totalUsers", allUsers.size());
            response.put("updated", updated);
            response.put("skipped", skipped);
            response.put("institution", Map.of(
                "id", institution.getId(),
                "name", institution.getName()
            ));

            System.out.println("✅ Proceso completado: " + updated + " usuarios actualizados, " + skipped + " omitidos");

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            System.err.println("❌ Error asignando usuarios: " + e.getMessage());
            e.printStackTrace();

            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Error al asignar usuarios: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    /**
     * Ver estadísticas de usuarios por institución
     */
    @GetMapping("/user-stats")
    public ResponseEntity<?> getUserStats() {
        try {
            System.out.println("📊 Obteniendo estadísticas de usuarios...");

            List<User> allUsers = userRepository.findAll();
            long usersWithInstitution = allUsers.stream()
                .filter(u -> u.getInstitution() != null)
                .count();
            long usersWithoutInstitution = allUsers.stream()
                .filter(u -> u.getInstitution() == null)
                .count();

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("totalUsers", allUsers.size());
            response.put("usersWithInstitution", usersWithInstitution);
            response.put("usersWithoutInstitution", usersWithoutInstitution);

            System.out.println("✅ Estadísticas: Total=" + allUsers.size() + 
                             ", Con institución=" + usersWithInstitution + 
                             ", Sin institución=" + usersWithoutInstitution);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            System.err.println("❌ Error obteniendo estadísticas: " + e.getMessage());

            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Error al obtener estadísticas: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    /**
     * Ejecutar script SQL desde archivo
     * SOLO PARA DESARROLLO
     */
    @PostMapping("/execute-sql-script")
    @Transactional
    public ResponseEntity<?> executeSqlScript(@RequestParam String scriptName) {
        try {
            System.out.println("🔧 Ejecutando script SQL: " + scriptName);

            // Leer el archivo SQL
            String scriptPath = "backend/" + scriptName;
            String sqlContent = new String(Files.readAllBytes(Paths.get(scriptPath)));

            // Dividir por punto y coma para ejecutar cada statement
            String[] statements = sqlContent.split(";");
            int executed = 0;
            int failed = 0;

            for (String statement : statements) {
                String trimmed = statement.trim();
                if (trimmed.isEmpty() || trimmed.startsWith("--")) {
                    continue; // Saltar comentarios y líneas vacías
                }

                try {
                    // Ejecutar cada statement
                    if (trimmed.toUpperCase().startsWith("SELECT")) {
                        // Para SELECT, solo ejecutar sin procesar resultados
                        entityManager.createNativeQuery(trimmed).getResultList();
                    } else {
                        entityManager.createNativeQuery(trimmed).executeUpdate();
                    }
                    executed++;
                } catch (Exception e) {
                    System.err.println("⚠️ Error en statement: " + trimmed.substring(0, Math.min(50, trimmed.length())));
                    System.err.println("   Error: " + e.getMessage());
                    failed++;
                }
            }

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Script ejecutado");
            response.put("scriptName", scriptName);
            response.put("statementsExecuted", executed);
            response.put("statementsFailed", failed);

            System.out.println("✅ Script completado: " + executed + " statements ejecutados, " + failed + " fallidos");

            return ResponseEntity.ok(response);

        } catch (IOException e) {
            System.err.println("❌ Error leyendo archivo: " + e.getMessage());

            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Error leyendo archivo: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);

        } catch (Exception e) {
            System.err.println("❌ Error ejecutando script: " + e.getMessage());
            e.printStackTrace();

            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Error ejecutando script: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
}
