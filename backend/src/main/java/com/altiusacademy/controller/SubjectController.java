package com.altiusacademy.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.altiusacademy.model.entity.Subject;
import com.altiusacademy.model.entity.User;
import com.altiusacademy.repository.mysql.SubjectRepository;
import com.altiusacademy.repository.mysql.UserRepository;

@RestController
@RequestMapping("/api/subjects")
public class SubjectController {

    // Endpoint de debug público (temporal)
    @GetMapping("/api/debug/preescolar-raw/{institutionId}")
    public ResponseEntity<?> debugPreescolarPublic(@PathVariable Long institutionId) {
        try {
            List<Subject> allSubjects = subjectRepository.findByInstitutionId(institutionId);

            List<Map<String, Object>> preescolarData = new ArrayList<>();
            for (Subject s : allSubjects) {
                if (s.getSchoolGrade() != null && s.getSchoolGrade().getGradeLevel() == 0) {
                    Map<String, Object> data = new HashMap<>();
                    data.put("subjectId", s.getId());
                    data.put("name", s.getName());
                    data.put("teacherIdInDB", s.getTeacher() != null ? s.getTeacher().getId() : "NULL");
                    data.put("teacherName",
                            s.getTeacher() != null ? s.getTeacher().getFirstName() + " " + s.getTeacher().getLastName()
                                    : "NULL");
                    data.put("gradeLevel", s.getSchoolGrade().getGradeLevel());
                    data.put("gradeName", s.getSchoolGrade().getGradeName());
                    preescolarData.add(data);
                }
            }

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("institutionId", institutionId);
            response.put("preescolarSubjects", preescolarData);
            response.put("total", preescolarData.size());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("error", e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body(response);
        }
    }

    @Autowired
    private SubjectRepository subjectRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private com.altiusacademy.repository.mysql.TeacherGradeRepository teacherGradeRepository;

    @GetMapping("/institution/{institutionId}")
    public ResponseEntity<?> getSubjectsByInstitution(@PathVariable Long institutionId) {
        try {
            System.out.println("🔍 Buscando materias para institución: " + institutionId);
            List<Subject> subjects = subjectRepository.findByInstitutionId(institutionId);
            System.out.println("📊 Total materias encontradas: " + subjects.size());

            List<Map<String, Object>> subjectList = subjects.stream().map(subject -> {
                Map<String, Object> subjectMap = new HashMap<>();
                subjectMap.put("id", subject.getId());
                subjectMap.put("name", subject.getName());
                subjectMap.put("description", subject.getDescription());
                subjectMap.put("color", subject.getColor());
                subjectMap.put("isActive", subject.getIsActive());

                // Log para debug
                System.out.println("📚 Materia: " + subject.getName() +
                        " | Teacher ID: " + (subject.getTeacher() != null ? subject.getTeacher().getId() : "NULL") +
                        " | Grade Level: "
                        + (subject.getSchoolGrade() != null ? subject.getSchoolGrade().getGradeLevel() : "NULL"));

                if (subject.getSchoolGrade() != null) {
                    Map<String, Object> gradeMap = new HashMap<>();
                    gradeMap.put("id", subject.getSchoolGrade().getId());
                    gradeMap.put("gradeName", subject.getSchoolGrade().getGradeName());
                    gradeMap.put("gradeLevel", subject.getSchoolGrade().getGradeLevel());
                    subjectMap.put("schoolGrade", gradeMap);
                }

                if (subject.getTeacher() != null) {
                    Map<String, Object> teacherMap = new HashMap<>();
                    teacherMap.put("id", subject.getTeacher().getId());
                    teacherMap.put("firstName", subject.getTeacher().getFirstName());
                    teacherMap.put("lastName", subject.getTeacher().getLastName());
                    teacherMap.put("email", subject.getTeacher().getEmail());
                    subjectMap.put("teacher", teacherMap);
                } else {
                    System.out.println("⚠️ Materia sin profesor: " + subject.getName());
                }

                return subjectMap;
            }).collect(Collectors.toList());

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("subjects", subjectList);
            response.put("total", subjectList.size());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Error al obtener materias: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping("/teacher/{teacherId}")
    public ResponseEntity<?> getSubjectsByTeacher(@PathVariable Long teacherId) {
        try {
            List<Subject> subjects = subjectRepository.findByTeacherId(teacherId);

            List<Map<String, Object>> subjectList = subjects.stream().map(subject -> {
                Map<String, Object> subjectMap = new HashMap<>();
                subjectMap.put("id", subject.getId());
                subjectMap.put("name", subject.getName());
                subjectMap.put("description", subject.getDescription());
                subjectMap.put("color", subject.getColor());
                subjectMap.put("isActive", subject.getIsActive());

                if (subject.getSchoolGrade() != null) {
                    Map<String, Object> gradeMap = new HashMap<>();
                    gradeMap.put("id", subject.getSchoolGrade().getId());
                    gradeMap.put("gradeName", subject.getSchoolGrade().getGradeName());
                    gradeMap.put("gradeLevel", subject.getSchoolGrade().getGradeLevel());
                    subjectMap.put("schoolGrade", gradeMap);
                }

                return subjectMap;
            }).collect(Collectors.toList());

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("subjects", subjectList);
            response.put("total", subjectList.size());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Error al obtener materias: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping("/debug/raw/{institutionId}")
    public ResponseEntity<?> debugRawData(@PathVariable Long institutionId) {
        try {
            // Obtener materias de Preescolar directamente
            List<Subject> allSubjects = subjectRepository.findByInstitutionId(institutionId);

            List<Map<String, Object>> preescolarData = new ArrayList<>();
            for (Subject s : allSubjects) {
                if (s.getSchoolGrade() != null && s.getSchoolGrade().getGradeLevel() == 0) {
                    Map<String, Object> data = new HashMap<>();
                    data.put("subjectId", s.getId());
                    data.put("name", s.getName());
                    data.put("teacherIdInDB", s.getTeacher() != null ? s.getTeacher().getId() : "NULL");
                    data.put("teacherName",
                            s.getTeacher() != null ? s.getTeacher().getFirstName() + " " + s.getTeacher().getLastName()
                                    : "NULL");
                    data.put("gradeLevel", s.getSchoolGrade().getGradeLevel());
                    data.put("gradeName", s.getSchoolGrade().getGradeName());
                    preescolarData.add(data);
                }
            }

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("institutionId", institutionId);
            response.put("preescolarSubjects", preescolarData);
            response.put("total", preescolarData.size());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("error", e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping("/debug/distribution/{institutionId}")
    public ResponseEntity<?> debugDistribution(@PathVariable Long institutionId) {
        try {
            List<com.altiusacademy.model.entity.TeacherGrade> teacherGrades = teacherGradeRepository
                    .findAllByInstitutionWithTeacher(institutionId);

            List<Subject> allSubjects = subjectRepository.findByInstitutionId(institutionId);

            String[] gradeLevelNames = { "Preescolar", "Primero", "Segundo", "Tercero", "Cuarto", "Quinto" };

            List<Map<String, Object>> gradeInfo = new ArrayList<>();

            for (com.altiusacademy.model.entity.TeacherGrade tg : teacherGrades) {
                String expectedGradeName = gradeLevelNames[tg.getGradeLevel()] + " " + tg.getSection();

                List<Subject> matchingSubjects = allSubjects.stream()
                        .filter(s -> s.getSchoolGrade() != null &&
                                s.getSchoolGrade().getGradeLevel().equals(tg.getGradeLevel()) &&
                                s.getSchoolGrade().getGradeName().equals(expectedGradeName))
                        .collect(Collectors.toList());

                Map<String, Object> info = new HashMap<>();
                info.put("teacherGradeId", tg.getId());
                info.put("teacherName", tg.getTeacher().getFirstName() + " " + tg.getTeacher().getLastName());
                info.put("gradeLevel", tg.getGradeLevel());
                info.put("section", tg.getSection());
                info.put("expectedGradeName", expectedGradeName);
                info.put("matchingSubjectsCount", matchingSubjects.size());

                if (!matchingSubjects.isEmpty()) {
                    info.put("actualGradeName", matchingSubjects.get(0).getSchoolGrade().getGradeName());
                    info.put("subjectNames",
                            matchingSubjects.stream().map(Subject::getName).collect(Collectors.toList()));
                }

                gradeInfo.add(info);
            }

            // También listar todos los nombres de grado únicos en la BD
            List<String> uniqueGradeNames = allSubjects.stream()
                    .filter(s -> s.getSchoolGrade() != null)
                    .map(s -> s.getSchoolGrade().getGradeName())
                    .distinct()
                    .sorted()
                    .collect(Collectors.toList());

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("totalTeacherGrades", teacherGrades.size());
            response.put("totalSubjects", allSubjects.size());
            response.put("uniqueGradeNamesInDB", uniqueGradeNames);
            response.put("gradeDetails", gradeInfo);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("error", e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping("/debug/preescolar/{institutionId}")
    public ResponseEntity<?> debugPreescolar(@PathVariable Long institutionId) {
        try {
            List<Subject> preescolarSubjects = subjectRepository.findByInstitutionId(institutionId)
                    .stream()
                    .filter(s -> s.getSchoolGrade() != null && s.getSchoolGrade().getGradeLevel() == 0)
                    .collect(Collectors.toList());

            List<Map<String, Object>> debug = preescolarSubjects.stream().map(s -> {
                Map<String, Object> info = new HashMap<>();
                info.put("id", s.getId());
                info.put("name", s.getName());
                info.put("teacherId", s.getTeacher() != null ? s.getTeacher().getId() : null);
                info.put("teacherName",
                        s.getTeacher() != null ? s.getTeacher().getFirstName() + " " + s.getTeacher().getLastName()
                                : "NULL");
                info.put("gradeLevel", s.getSchoolGrade().getGradeLevel());
                info.put("gradeName", s.getSchoolGrade().getGradeName());
                return info;
            }).collect(Collectors.toList());

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("institutionId", institutionId);
            response.put("totalPreescolar", preescolarSubjects.size());
            response.put("subjects", debug);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping("/debug/grade-names/{institutionId}")
    public ResponseEntity<?> debugGradeNames(@PathVariable Long institutionId) {
        try {
            List<Subject> subjects = subjectRepository.findByInstitutionId(institutionId);

            // Obtener todos los nombres de grado únicos
            List<String> uniqueGradeNames = subjects.stream()
                    .filter(s -> s.getSchoolGrade() != null)
                    .map(s -> s.getSchoolGrade().getGradeName())
                    .distinct()
                    .sorted()
                    .collect(Collectors.toList());

            // Contar materias por grado
            Map<String, Long> subjectsByGrade = subjects.stream()
                    .filter(s -> s.getSchoolGrade() != null)
                    .collect(Collectors.groupingBy(
                            s -> s.getSchoolGrade().getGradeName() + " (nivel " + s.getSchoolGrade().getGradeLevel()
                                    + ")",
                            Collectors.counting()));

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("totalSubjects", subjects.size());
            response.put("uniqueGradeNames", uniqueGradeNames);
            response.put("subjectsByGrade", subjectsByGrade);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping("/stats/institution/{institutionId}")
    public ResponseEntity<?> getSubjectStats(@PathVariable Long institutionId) {
        try {
            List<Subject> subjects = subjectRepository.findByInstitutionId(institutionId);

            long totalSubjects = subjects.size();
            long activeSubjects = subjects.stream().filter(s -> s.getIsActive()).count();
            long subjectsWithTeacher = subjects.stream().filter(s -> s.getTeacher() != null).count();
            long subjectsWithoutTeacher = totalSubjects - subjectsWithTeacher;

            // Agrupar por grado
            Map<String, Long> subjectsByGrade = subjects.stream()
                    .filter(s -> s.getSchoolGrade() != null)
                    .collect(Collectors.groupingBy(
                            s -> s.getSchoolGrade().getGradeName(),
                            Collectors.counting()));

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("totalSubjects", totalSubjects);
            response.put("activeSubjects", activeSubjects);
            response.put("subjectsWithTeacher", subjectsWithTeacher);
            response.put("subjectsWithoutTeacher", subjectsWithoutTeacher);
            response.put("subjectsByGrade", subjectsByGrade);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Error al obtener estadísticas: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @PutMapping("/{subjectId}/assign-teacher")
    public ResponseEntity<?> assignTeacherToSubject(
            @PathVariable Long subjectId,
            @RequestBody Map<String, Object> request) {
        try {
            System.out.println("📥 Recibida petición assign-teacher:");
            System.out.println("   Subject ID: " + subjectId);
            System.out.println("   Request body: " + request);

            if (request == null || !request.containsKey("teacherId")) {
                throw new RuntimeException("teacherId es requerido en el body");
            }

            Long teacherId = Long.valueOf(request.get("teacherId").toString());
            System.out.println("   Teacher ID: " + teacherId);

            Subject subject = subjectRepository.findById(subjectId)
                    .orElseThrow(() -> new RuntimeException("Materia no encontrada con ID: " + subjectId));

            User teacher = userRepository.findById(teacherId)
                    .orElseThrow(() -> new RuntimeException("Profesor no encontrado con ID: " + teacherId));

            System.out.println("   Profesor encontrado: " + teacher.getFirstName() + " " + teacher.getLastName());
            System.out.println("   Rol del usuario: " + teacher.getRole());

            // Verificar que el usuario sea profesor
            if (teacher.getRole() != com.altiusacademy.model.enums.UserRole.TEACHER) {
                throw new RuntimeException("El usuario no es un profesor. Rol actual: " + teacher.getRole());
            }

            subject.setTeacher(teacher);
            subjectRepository.save(subject);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Profesor asignado exitosamente");
            response.put("subjectId", subjectId);
            response.put("teacherId", teacherId);

            System.out.println("✅ Profesor " + teacher.getFirstName() + " " + teacher.getLastName() +
                    " asignado a materia " + subject.getName());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            System.err.println("❌ Error en assign-teacher: " + e.getMessage());
            e.printStackTrace();

            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Error al asignar profesor: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @org.springframework.web.bind.annotation.PostMapping("/auto-distribute-by-grade/{institutionId}")
    public ResponseEntity<?> autoDistributeByGrade(@PathVariable Long institutionId) {
        try {
            System.out.println("🔄 Distribución automática por grado para institución: " + institutionId);

            // 1. Obtener todas las asignaciones profesor-grado
            List<com.altiusacademy.model.entity.TeacherGrade> teacherGrades = teacherGradeRepository
                    .findAllByInstitutionWithTeacher(institutionId);

            if (teacherGrades.isEmpty()) {
                throw new RuntimeException("No hay profesores asignados a grados");
            }

            // 2. Limpiar asignaciones actuales
            List<Subject> allSubjects = subjectRepository.findByInstitutionId(institutionId);
            for (Subject s : allSubjects) {
                s.setTeacher(null);
                subjectRepository.save(s);
            }

            // 3. Agrupar por grado
            Map<String, List<com.altiusacademy.model.entity.TeacherGrade>> gradeGroups = new HashMap<>();
            for (com.altiusacademy.model.entity.TeacherGrade tg : teacherGrades) {
                String gradeKey = tg.getGradeLevel() + "-" + tg.getSection();
                gradeGroups.computeIfAbsent(gradeKey, k -> new ArrayList<>()).add(tg);
            }

            int totalAssigned = 0;

            // 4. Para cada grado, distribuir sus materias entre sus profesores
            for (Map.Entry<String, List<com.altiusacademy.model.entity.TeacherGrade>> entry : gradeGroups.entrySet()) {
                List<com.altiusacademy.model.entity.TeacherGrade> teachersInGrade = entry.getValue();

                if (teachersInGrade.isEmpty())
                    continue;

                Integer gradeLevel = teachersInGrade.get(0).getGradeLevel();
                String section = teachersInGrade.get(0).getSection();

                // Obtener materias de este grado
                List<Subject> gradeSubjects = allSubjects.stream()
                        .filter(s -> s.getSchoolGrade() != null &&
                                s.getSchoolGrade().getGradeLevel().equals(gradeLevel) &&
                                s.getSchoolGrade().getGradeName().contains(section))
                        .collect(Collectors.toList());

                System.out.println("📚 Grado " + gradeLevel + section + ": " +
                        gradeSubjects.size() + " materias, " + teachersInGrade.size() + " profesores");

                // Distribuir materias equitativamente
                int subjectIndex = 0;
                for (int i = 0; i < teachersInGrade.size() && subjectIndex < gradeSubjects.size(); i++) {
                    User teacher = teachersInGrade.get(i).getTeacher();
                    int subjectsPerTeacher = gradeSubjects.size() / teachersInGrade.size();
                    int extra = (i < (gradeSubjects.size() % teachersInGrade.size())) ? 1 : 0;
                    int subjectsToAssign = subjectsPerTeacher + extra;

                    for (int j = 0; j < subjectsToAssign && subjectIndex < gradeSubjects.size(); j++) {
                        Subject subject = gradeSubjects.get(subjectIndex);
                        subject.setTeacher(teacher);
                        subjectRepository.save(subject);
                        subjectIndex++;
                        totalAssigned++;
                    }

                    System.out.println("  ✅ " + teacher.getFirstName() + " " + teacher.getLastName() +
                            ": " + subjectsToAssign + " materias");
                }
            }

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Distribución completada");
            response.put("totalGrades", gradeGroups.size());
            response.put("totalAssignments", teacherGrades.size());
            response.put("subjectsAssigned", totalAssigned);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body(response);
        }
    }

    @org.springframework.web.bind.annotation.PostMapping("/auto-distribute/{institutionId}")
    public ResponseEntity<?> autoDistributeSubjects(@PathVariable Long institutionId) {
        try {
            System.out.println("🔄 Iniciando distribución automática OPTIMIZADA para institución: " + institutionId);
            System.out.println("📋 Objetivo: 38 profesores con 4 materias, 28 profesores con 3 materias");

            // 1. Obtener todas las asignaciones de profesores a grados
            List<com.altiusacademy.model.entity.TeacherGrade> teacherGrades = teacherGradeRepository
                    .findAllByInstitutionWithTeacher(institutionId);

            System.out.println("👥 Total asignaciones profesor-grado encontradas: " + teacherGrades.size());

            if (teacherGrades.isEmpty()) {
                throw new RuntimeException(
                        "No hay profesores asignados a grados. Por favor, asigne profesores a grados primero.");
            }

            // 2. Limpiar asignaciones previas
            List<Subject> allSubjects = subjectRepository.findByInstitutionId(institutionId);
            for (Subject s : allSubjects) {
                s.setTeacher(null);
            }
            subjectRepository.saveAll(allSubjects);
            System.out.println("🧹 Limpiadas asignaciones previas");

            int assignedCount = 0;
            Map<Long, Integer> teacherSubjectCount = new HashMap<>();
            Map<Long, List<String>> teacherSubjectNames = new HashMap<>();

            // 3. Crear lista de profesores únicos y determinar su objetivo
            Map<Long, User> teacherMap = new HashMap<>();
            for (com.altiusacademy.model.entity.TeacherGrade tg : teacherGrades) {
                User teacher = tg.getTeacher();
                teacherMap.put(teacher.getId(), teacher);
            }
            List<User> uniqueTeachers = new ArrayList<>(teacherMap.values());

            System.out.println("👥 Profesores únicos: " + uniqueTeachers.size());

            // 4. Calcular distribución objetivo basada en profesores únicos
            int totalUniqueTeachers = uniqueTeachers.size();
            int teachersWith4 = Math.min(38, totalUniqueTeachers);
            int teachersWith3 = Math.max(0, totalUniqueTeachers - teachersWith4);

            System.out.println("🎯 Distribución objetivo: " + teachersWith4 + " profesores con 4 materias, " +
                    teachersWith3 + " profesores con 3 materias");

            // 5. Asignar objetivo a cada profesor
            Map<Long, Integer> teacherTargets = new HashMap<>();
            for (int i = 0; i < uniqueTeachers.size(); i++) {
                User teacher = uniqueTeachers.get(i);
                int target = (i < teachersWith4) ? 4 : 3;
                teacherTargets.put(teacher.getId(), target);
            }

            // 6. Agrupar asignaciones por grado-sección
            Map<String, List<com.altiusacademy.model.entity.TeacherGrade>> gradeGroups = new HashMap<>();
            String[] gradeLevelNames = { "Preescolar", "Primero", "Segundo", "Tercero", "Cuarto", "Quinto" };

            for (com.altiusacademy.model.entity.TeacherGrade tg : teacherGrades) {
                String gradeKey = gradeLevelNames[tg.getGradeLevel()] + " " + tg.getSection();
                gradeGroups.computeIfAbsent(gradeKey, k -> new ArrayList<>()).add(tg);
            }

            System.out.println("📊 Total grados únicos: " + gradeGroups.size());

            // 7. Para cada grado, distribuir materias entre sus profesores
            for (Map.Entry<String, List<com.altiusacademy.model.entity.TeacherGrade>> entry : gradeGroups.entrySet()) {
                String gradeName = entry.getKey();
                List<com.altiusacademy.model.entity.TeacherGrade> teachersInGrade = entry.getValue();

                System.out.println("\n📚 Procesando grado: " + gradeName);
                System.out.println("👥 Profesores asignados: " + teachersInGrade.size());

                // Obtener materias de este grado
                com.altiusacademy.model.entity.TeacherGrade firstTg = teachersInGrade.get(0);
                Integer gradeLevel = firstTg.getGradeLevel();
                String section = firstTg.getSection();

                // Buscar materias por nivel de grado y sección (más flexible)
                List<Subject> gradeSubjects = allSubjects.stream()
                        .filter(s -> s.getSchoolGrade() != null &&
                                s.getSchoolGrade().getGradeLevel().equals(gradeLevel) &&
                                (s.getSchoolGrade().getGradeName().equals(gradeName) ||
                                        s.getSchoolGrade().getGradeName().equals(gradeLevel + section) ||
                                        s.getSchoolGrade().getGradeName().contains(section)))
                        .collect(Collectors.toList());

                System.out.println("📖 Total materias en este grado: " + gradeSubjects.size());

                if (gradeSubjects.isEmpty()) {
                    System.out.println("⚠️ No hay materias para este grado");
                    continue;
                }

                // 8. Distribuir materias respetando el objetivo de cada profesor
                int subjectIndex = 0;
                for (int i = 0; i < teachersInGrade.size() && subjectIndex < gradeSubjects.size(); i++) {
                    User teacher = teachersInGrade.get(i).getTeacher();
                    Long teacherId = teacher.getId();

                    // Determinar cuántas materias puede recibir este profesor
                    int currentCount = teacherSubjectCount.getOrDefault(teacherId, 0);
                    int targetCount = teacherTargets.getOrDefault(teacherId, 3);
                    int remaining = targetCount - currentCount;

                    if (remaining <= 0) {
                        System.out.println("  ⏭️ " + teacher.getFirstName() + " " + teacher.getLastName() +
                                " ya alcanzó su objetivo (" + currentCount + "/" + targetCount + ")");
                        continue;
                    }

                    // Calcular cuántas materias asignar en este grado
                    int availableInGrade = gradeSubjects.size() - subjectIndex;
                    int subjectsToAssign = Math.min(remaining, availableInGrade);

                    System.out.println("\n  👤 " + teacher.getFirstName() + " " + teacher.getLastName() +
                            " recibirá " + subjectsToAssign + " materias (actual: " + currentCount +
                            ", objetivo: " + targetCount + "):");

                    teacherSubjectNames.putIfAbsent(teacherId, new ArrayList<>());

                    for (int j = 0; j < subjectsToAssign && subjectIndex < gradeSubjects.size(); j++) {
                        Subject subject = gradeSubjects.get(subjectIndex);
                        subject.setTeacher(teacher);
                        assignedCount++;
                        subjectIndex++;

                        int newCount = currentCount + j + 1;
                        teacherSubjectCount.put(teacherId, newCount);
                        teacherSubjectNames.get(teacherId).add(subject.getName());

                        System.out.println("    ✅ " + subject.getName());
                    }
                }
            }

            // 9. Guardar todas las asignaciones
            subjectRepository.saveAll(allSubjects);
            System.out.println("\n💾 Guardadas todas las asignaciones");

            // 10. Preparar estadísticas detalladas
            List<Map<String, Object>> teacherStats = new ArrayList<>();
            int countWith4 = 0;
            int countWith3 = 0;
            int countWithOther = 0;

            for (User teacher : uniqueTeachers) {
                Long teacherId = teacher.getId();
                int count = teacherSubjectCount.getOrDefault(teacherId, 0);

                Map<String, Object> stat = new HashMap<>();
                stat.put("teacherId", teacherId);
                stat.put("teacherName", teacher.getFirstName() + " " + teacher.getLastName());
                stat.put("subjectCount", count);
                stat.put("subjects", teacherSubjectNames.getOrDefault(teacherId, new ArrayList<>()));
                teacherStats.add(stat);

                if (count == 4)
                    countWith4++;
                else if (count == 3)
                    countWith3++;
                else
                    countWithOther++;
            }

            // Ordenar por cantidad de materias (descendente)
            teacherStats.sort((a, b) -> {
                int countA = (int) a.get("subjectCount");
                int countB = (int) b.get("subjectCount");
                return Integer.compare(countB, countA);
            });

            // 10. Preparar respuesta
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Distribución automática completada");
            response.put("totalGrades", gradeGroups.size());
            response.put("totalTeachers", uniqueTeachers.size());
            response.put("subjectsAssigned", assignedCount);
            response.put("teachersWith4Subjects", countWith4);
            response.put("teachersWith3Subjects", countWith3);
            response.put("teachersWithOther", countWithOther);
            response.put("teacherStats", teacherStats);

            System.out.println("\n✅ Distribución completada:");
            System.out.println("   📊 " + assignedCount + " materias asignadas");
            System.out.println("   👥 " + uniqueTeachers.size() + " profesores");
            System.out.println("   ✅ " + countWith4 + " profesores con 4 materias");
            System.out.println("   ✅ " + countWith3 + " profesores con 3 materias");
            System.out.println("   ⚠️ " + countWithOther + " profesores con otra cantidad");

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Error en distribución automática: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body(response);
        }
    }
}
