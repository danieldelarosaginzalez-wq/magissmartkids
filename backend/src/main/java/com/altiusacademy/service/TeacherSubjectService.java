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
    
    public TeacherSubjectService(
            UserRepository userRepository,
            TaskRepository taskRepository,
            TaskSubmissionRepository taskSubmissionRepository) {
        this.userRepository = userRepository;
        this.taskRepository = taskRepository;
        this.taskSubmissionRepository = taskSubmissionRepository;
    }
    
    public Map<String, Object> getTeacherSubjectsWithStats(String email) {
        // Obtener el profesor
        User teacher = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Profesor no encontrado"));
        
        // Obtener todas las tareas del profesor agrupadas por materia y grado
        List<Task> tasks = taskRepository.findByTeacherId(teacher.getId());
        
        // Agrupar por materia y grado
        Map<String, List<Task>> tasksBySubjectAndGrade = tasks.stream()
                .collect(Collectors.groupingBy(task -> 
                    task.getSubject().getId() + "-" + task.getGrade()
                ));
        
        List<Map<String, Object>> subjects = new ArrayList<>();
        
        for (Map.Entry<String, List<Task>> entry : tasksBySubjectAndGrade.entrySet()) {
            List<Task> subjectTasks = entry.getValue();
            if (subjectTasks.isEmpty()) continue;
            
            Task firstTask = subjectTasks.get(0);
            String grade = firstTask.getGrade();
            
            // Contar estudiantes del grado
            long totalStudents = userRepository.countBySchoolGradeGradeName(grade);
            
            // Estadísticas de tareas
            int totalTasks = subjectTasks.size();
            
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
            String color = getSubjectColor(firstTask.getSubject().getName());
            
            Map<String, Object> subjectData = new HashMap<>();
            subjectData.put("id", firstTask.getSubject().getId());
            subjectData.put("name", firstTask.getSubject().getName());
            subjectData.put("description", firstTask.getSubject().getDescription());
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
}
