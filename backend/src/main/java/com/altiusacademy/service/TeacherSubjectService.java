package com.altiusacademy.service;

import com.altiusacademy.model.entity.*;
import com.altiusacademy.repository.mysql.*;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class TeacherSubjectService {
    
    private final UserRepository userRepository;
    private final TaskRepository taskRepository;
    private final TaskSubmissionRepository taskSubmissionRepository;
    private final TeacherSubjectRepository teacherSubjectRepository;
    private final SubjectRepository subjectRepository;
    
    public TeacherSubjectService(
            UserRepository userRepository,
            TaskRepository taskRepository,
            TaskSubmissionRepository taskSubmissionRepository,
            TeacherSubjectRepository teacherSubjectRepository,
            SubjectRepository subjectRepository) {
        this.userRepository = userRepository;
        this.taskRepository = taskRepository;
        this.taskSubmissionRepository = taskSubmissionRepository;
        this.teacherSubjectRepository = teacherSubjectRepository;
        this.subjectRepository = subjectRepository;
    }
    
    public Map<String, Object> getTeacherSubjectsWithStats(String email) {
        // Obtener el profesor
        User teacher = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Profesor no encontrado"));
        
        // ✅ USAR teacher_subjects en lugar de tasks
        List<TeacherSubject> teacherSubjects = teacherSubjectRepository.findByTeacherId(teacher.getId());
        
        List<Map<String, Object>> subjects = new ArrayList<>();
        
        for (TeacherSubject ts : teacherSubjects) {
            if (!ts.getIsActive()) continue;
            
            // Obtener la materia completa
            Optional<Subject> subjectOpt = subjectRepository.findById(ts.getSubjectId());
            if (!subjectOpt.isPresent()) continue;
            
            Subject subject = subjectOpt.get();
            String grade = ts.getGrade();
            
            // Contar estudiantes del grado
            long totalStudents = userRepository.countBySchoolGradeGradeName(grade);
            
            // Obtener tareas de esta materia y grado usando query directa
            List<Task> subjectTasks = taskRepository.findByTeacherIdAndSubjectIdAndGrade(
                teacher.getId(), 
                ts.getSubjectId(), 
                grade
            );
            
            int totalTasks = subjectTasks.size();
            
            System.out.println("📊 DEBUG - Grade: " + grade + ", Subject: " + subject.getName() + ", Total Tasks: " + totalTasks);
            
            // Obtener todas las entregas de estas tareas
            List<Long> taskIds = subjectTasks.stream()
                    .map(Task::getId)
                    .collect(Collectors.toList());
            
            List<TaskSubmission> submissions = taskIds.isEmpty() ? 
                    new ArrayList<>() : 
                    taskSubmissionRepository.findByTaskIdIn(taskIds);
            
            // Contar entregas calificadas (completadas)
            long completedTasks = submissions.stream()
                    .filter(s -> s.getStatus() == TaskSubmission.SubmissionStatus.GRADED)
                    .count();
            
            // Calcular tareas pendientes: (total tareas × estudiantes) - entregas realizadas
            long totalExpectedSubmissions = (long) totalTasks * totalStudents;
            long pendingTasks = totalExpectedSubmissions - submissions.size();
            
            // Calcular promedio de calificaciones solo de las calificadas
            double averageGrade = submissions.stream()
                    .filter(s -> s.getScore() != null && s.getStatus() == TaskSubmission.SubmissionStatus.GRADED)
                    .mapToDouble(TaskSubmission::getScore)
                    .average()
                    .orElse(0.0);
            
            // Calcular progreso: (entregas calificadas / total esperado) × 100
            int progress = totalExpectedSubmissions > 0
                    ? (int) ((completedTasks * 100.0) / totalExpectedSubmissions)
                    : 0;
            
            // Colores por materia
            String color = subject.getColor() != null ? subject.getColor() : getSubjectColor(subject.getName());
            
            Map<String, Object> subjectData = new HashMap<>();
            subjectData.put("id", subject.getId());
            subjectData.put("name", subject.getName());
            subjectData.put("description", subject.getDescription());
            subjectData.put("grade", grade);
            subjectData.put("color", color);
            subjectData.put("totalStudents", totalStudents);
            subjectData.put("totalTasks", totalTasks);
            subjectData.put("completedTasks", completedTasks);
            subjectData.put("pendingTasks", pendingTasks);
            subjectData.put("progress", progress);
            subjectData.put("averageGrade", Math.round(averageGrade * 100.0) / 100.0);
            
            subjects.add(subjectData);
        }
        
        // ✅ Ordenar materias por grado y luego por nombre de materia
        subjects.sort((s1, s2) -> {
            String grade1 = (String) s1.get("grade");
            String grade2 = (String) s2.get("grade");
            
            // Primero ordenar por grado
            int gradeCompare = compareGrades(grade1, grade2);
            if (gradeCompare != 0) {
                return gradeCompare;
            }
            
            // Si el grado es igual, ordenar por nombre de materia
            String name1 = (String) s1.get("name");
            String name2 = (String) s2.get("name");
            return name1.compareTo(name2);
        });
        
        Map<String, Object> response = new HashMap<>();
        response.put("subjects", subjects);
        response.put("totalSubjects", subjects.size());
        
        return response;
    }
    
    private String getSubjectColor(String subjectName) {
        Map<String, String> colors = Map.of(
            "Matemáticas", "#3B82F6",
            "Ciencias Naturales", "#10B981",
            "Español", "#F59E0B",
            "Inglés", "#8B5CF6",
            "Historia", "#EF4444",
            "Geografía", "#06B6D4"
        );
        return colors.getOrDefault(subjectName, "#6B7280");
    }
    
    /**
     * Compara dos grados para ordenarlos correctamente
     * Ejemplo: "Segundo A" < "Tercero B" < "Cuarto C" < "Quinto A"
     */
    private int compareGrades(String grade1, String grade2) {
        // Mapeo de nombres de grados a números
        Map<String, Integer> gradeOrder = new HashMap<>();
        gradeOrder.put("Primero", 1);
        gradeOrder.put("Segundo", 2);
        gradeOrder.put("Tercero", 3);
        gradeOrder.put("Cuarto", 4);
        gradeOrder.put("Quinto", 5);
        gradeOrder.put("Sexto", 6);
        gradeOrder.put("Séptimo", 7);
        gradeOrder.put("Octavo", 8);
        gradeOrder.put("Noveno", 9);
        gradeOrder.put("Décimo", 10);
        gradeOrder.put("Undécimo", 11);
        
        // Extraer el número del grado (ej. "Segundo A" -> "Segundo")
        String gradeName1 = grade1.split(" ")[0];
        String gradeName2 = grade2.split(" ")[0];
        
        int order1 = gradeOrder.getOrDefault(gradeName1, 0);
        int order2 = gradeOrder.getOrDefault(gradeName2, 0);
        
        // Si los números son diferentes, ordenar por número
        if (order1 != order2) {
            return Integer.compare(order1, order2);
        }
        
        // Si los números son iguales, ordenar por la letra (A, B, C, etc.)
        return grade1.compareTo(grade2);
    }
}
