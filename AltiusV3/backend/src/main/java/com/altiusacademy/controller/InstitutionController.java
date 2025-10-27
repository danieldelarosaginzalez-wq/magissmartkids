package com.altiusacademy.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.altiusacademy.model.entity.Institution;
import com.altiusacademy.repository.mysql.InstitutionRepository;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/institutions")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001", "http://localhost:3002"}, allowCredentials = "true")
public class InstitutionController {

    @Autowired
    private InstitutionRepository institutionRepository;

    /**
     * Obtener todas las instituciones activas - Público para el registro
     */
    @GetMapping
    public ResponseEntity<?> getAllInstitutions() {
        try {
            System.out.println("🏛️ [GET] /api/institutions - Obteniendo todas las instituciones activas");

            List<Institution> institutions = institutionRepository.findByIsActiveTrue();

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Instituciones obtenidas correctamente");
            response.put("institutions", institutions);
            response.put("total", institutions.size());

            System.out.println("✅ Se encontraron " + institutions.size() + " instituciones");

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            System.err.println("❌ Error obteniendo instituciones: " + e.getMessage());

            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Error al obtener instituciones: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    /**
     * Obtener institución por ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getInstitutionById(@PathVariable Long id) {
        try {
            System.out.println("🔍 Obteniendo institución por ID: " + id);

            Optional<Institution> institutionOpt = institutionRepository.findById(id);
            if (institutionOpt.isEmpty()) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "Institución no encontrada");
                return ResponseEntity.notFound().build();
            }

            Institution institution = institutionOpt.get();
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("institution", institution);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            System.err.println("❌ Error obteniendo institución: " + e.getMessage());

            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Error al obtener institución: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    /**
     * Crear nueva institución - Permitido durante el registro
     */
    @PostMapping
    public ResponseEntity<?> createInstitution(@Valid @RequestBody Institution institution) {
        try {
            System.out.println("➕ [POST] /api/institutions - Creando nueva institución: " + institution.getName());

            // Validar datos requeridos
            if (institution.getName() == null || institution.getName().trim().isEmpty()) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "El nombre de la institución es requerido");
                return ResponseEntity.badRequest().body(response);
            }

            // Verificar que no exista una institución con el mismo nombre
            if (institutionRepository.existsByNameIgnoreCase(institution.getName().trim())) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "Ya existe una institución con ese nombre");
                return ResponseEntity.badRequest().body(response);
            }

            // ✅ VERIFICAR QUE NO EXISTA UNA INSTITUCIÓN CON EL MISMO NIT
            if (institution.getNit() != null && !institution.getNit().trim().isEmpty()) {
                if (institutionRepository.existsByNit(institution.getNit().trim())) {
                    Map<String, Object> response = new HashMap<>();
                    response.put("success", false);
                    response.put("message", "Ya existe una institución con ese NIT");
                    return ResponseEntity.badRequest().body(response);
                }
            }

            // Limpiar y configurar datos
            institution.setName(institution.getName().trim());
            
            // ✅ PROCESAR CAMPO NIT
            if (institution.getNit() != null) {
                institution.setNit(institution.getNit().trim());
                System.out.println("📝 NIT procesado: " + institution.getNit());
            }
            
            if (institution.getAddress() != null) {
                institution.setAddress(institution.getAddress().trim());
            }
            if (institution.getPhone() != null) {
                institution.setPhone(institution.getPhone().trim());
            }
            if (institution.getEmail() != null) {
                institution.setEmail(institution.getEmail().trim().toLowerCase());
            }
            institution.setIsActive(true);

            Institution savedInstitution = institutionRepository.save(institution);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Institución creada correctamente");
            response.put("institution", savedInstitution);

            System.out.println("✅ Institución creada con ID: " + savedInstitution.getId());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            System.err.println("❌ Error creando institución: " + e.getMessage());
            e.printStackTrace();

            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Error al crear institución: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    /**
     * Validar NIT de institución - Para registro de coordinadores
     */
    @GetMapping("/validate-nit")
    public ResponseEntity<?> validateInstitutionNit(@RequestParam String nit) {
        try {
            System.out.println("🔍 Validando NIT de institución: " + nit);

            Optional<Institution> institutionOpt = institutionRepository.findByNit(nit);
            
            Map<String, Object> response = new HashMap<>();
            if (institutionOpt.isPresent()) {
                Institution institution = institutionOpt.get();
                response.put("success", true);
                response.put("exists", true);
                response.put("institution", Map.of(
                    "id", institution.getId(),
                    "name", institution.getName(),
                    "nit", institution.getNit(),
                    "isActive", institution.getIsActive()
                ));
                response.put("message", "Institución encontrada");
            } else {
                response.put("success", true);
                response.put("exists", false);
                response.put("message", "NIT no encontrado");
            }

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            System.err.println("❌ Error validando NIT: " + e.getMessage());

            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Error al validar NIT: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    /**
     * Validar email de estudiante en institución - Para registro de padres
     */
    @GetMapping("/validate-student")
    public ResponseEntity<?> validateStudentInInstitution(
            @RequestParam String email, 
            @RequestParam String institutionNit) {
        try {
            System.out.println("🔍 Validando estudiante: " + email + " en institución NIT: " + institutionNit);

            // Buscar la institución por NIT
            Optional<Institution> institutionOpt = institutionRepository.findByNit(institutionNit);
            if (institutionOpt.isEmpty()) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "Institución no encontrada");
                return ResponseEntity.badRequest().body(response);
            }

            // TODO: Implementar búsqueda de estudiante por email en la institución
            // Por ahora, simulamos la validación
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("exists", true); // Cambiar por lógica real
            response.put("student", Map.of(
                "email", email,
                "institutionNit", institutionNit,
                "institutionName", institutionOpt.get().getName()
            ));
            response.put("message", "Estudiante encontrado en la institución");

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            System.err.println("❌ Error validando estudiante: " + e.getMessage());

            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Error al validar estudiante: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    /**
     * Obtener grados académicos disponibles
     */
    @GetMapping("/school-grades")
    public ResponseEntity<?> getSchoolGrades() {
        try {
            List<String> grades = List.of(
                "1°", "2°", "3°", "4°", "5°", "6°", "7°", "8°", "9°", "10°", "11°"
            );

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("grades", grades);
            response.put("message", "Grados académicos obtenidos");

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            System.err.println("❌ Error obteniendo grados: " + e.getMessage());

            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Error al obtener grados: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    /**
     * Actualizar institución - Solo coordinadores
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('COORDINATOR')")
    public ResponseEntity<?> updateInstitution(@PathVariable Long id, @RequestBody Map<String, Object> updates) {
        try {
            System.out.println("✏️ Actualizando institución ID: " + id);

            Optional<Institution> institutionOpt = institutionRepository.findById(id);
            if (institutionOpt.isEmpty()) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "Institución no encontrada");
                return ResponseEntity.notFound().build();
            }

            Institution institution = institutionOpt.get();

            // Actualizar campos permitidos
            if (updates.containsKey("name")) {
                institution.setName((String) updates.get("name"));
            }
            if (updates.containsKey("address")) {
                institution.setAddress((String) updates.get("address"));
            }
            if (updates.containsKey("phone")) {
                institution.setPhone((String) updates.get("phone"));
            }
            if (updates.containsKey("email")) {
                institution.setEmail((String) updates.get("email"));
            }
            if (updates.containsKey("isActive")) {
                institution.setIsActive((Boolean) updates.get("isActive"));
            }

            Institution updatedInstitution = institutionRepository.save(institution);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Institución actualizada correctamente");
            response.put("institution", updatedInstitution);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            System.err.println("❌ Error actualizando institución: " + e.getMessage());

            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Error al actualizar institución: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
}