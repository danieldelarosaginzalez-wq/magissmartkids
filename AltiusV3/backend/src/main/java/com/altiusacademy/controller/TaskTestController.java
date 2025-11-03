package com.altiusacademy.controller;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.altiusacademy.model.entity.Subject;
import com.altiusacademy.model.entity.Task;
import com.altiusacademy.model.entity.User;
import com.altiusacademy.repository.mysql.SubjectRepository;
import com.altiusacademy.repository.mysql.TaskRepository;
import com.altiusacademy.repository.mysql.UserRepository;

/**
 * Controlador de prueba para crear tareas de ejemplo
 */
@RestController
@RequestMapping("/api/test/tasks")
@CrossOrigin(origins = "*")
public class TaskTestController {

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private SubjectRepository subjectRepository;

    /**
     * Crear tareas de ejemplo
     */
    @PostMapping("/create-sample")
    public ResponseEntity<String> createSampleTasks() {
        try {
            // Buscar un profesor y un estudiante
            Optional<User> teacherOpt = userRepository.findByEmail("d@profesor.com");
            if (teacherOpt.isEmpty()) {
                return ResponseEntity.badRequest().body("Profesor no encontrado");
            }
            
            // Buscar estudiantes
            List<User> students = userRepository.findAll().stream()
                    .filter(user -> "STUDENT".equals(user.getRole().name()))
                    .limit(3)
                    .toList();
            
            if (students.isEmpty()) {
                return ResponseEntity.badRequest().body("No se encontraron estudiantes");
            }
            
            // Buscar materias
            List<Subject> subjects = subjectRepository.findAll();
            if (subjects.isEmpty()) {
                return ResponseEntity.badRequest().body("No se encontraron materias");
            }
            
            User teacher = teacherOpt.get();
            Subject subject = subjects.get(0); // Usar la primera materia
            
            // Crear tareas de ejemplo
            for (int i = 0; i < students.size(); i++) {
                User student = students.get(i);
                
                Task task = new Task();
                task.setTitle("Tarea de ejemplo " + (i + 1));
                task.setDescription("Esta es una tarea de ejemplo para probar el sistema. Debes completar los ejercicios del capítulo " + (i + 1));
                task.setDueDate(LocalDate.now().plusDays(7 + i));
                task.setPriority(Task.TaskPriority.MEDIUM);
                task.setTeacher(teacher);
                task.setStudent(student);
                task.setSubject(subject);
                task.setMaxGrade(5.0);
                
                taskRepository.save(task);
            }
            
            return ResponseEntity.ok("Se crearon " + students.size() + " tareas de ejemplo exitosamente");
            
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error al crear tareas: " + e.getMessage());
        }
    }
    
    /**
     * Listar todas las tareas
     */
    @GetMapping("/list")
    public ResponseEntity<String> listAllTasks() {
        try {
            List<Task> tasks = taskRepository.findAll();
            StringBuilder result = new StringBuilder();
            result.append("Tareas encontradas:\n");
            for (Task task : tasks) {
                result.append("ID: ").append(task.getId())
                      .append(", Título: ").append(task.getTitle())
                      .append(", Estado: ").append(task.getStatus())
                      .append(", Profesor: ").append(task.getTeacher() != null ? task.getTeacher().getEmail() : "N/A")
                      .append(", Estudiante: ").append(task.getStudent() != null ? task.getStudent().getEmail() : "N/A")
                      .append("\n");
            }
            return ResponseEntity.ok(result.toString());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
    
    /**
     * Endpoint de prueba básico
     */
    @GetMapping("/ping")
    public ResponseEntity<String> ping() {
        return ResponseEntity.ok("TaskTestController funcionando correctamente");
    }
    
    /**
     * Obtener información de usuarios
     */
    @GetMapping("/users")
    public ResponseEntity<String> listUsers() {
        try {
            List<User> users = userRepository.findAll();
            StringBuilder result = new StringBuilder();
            result.append("Usuarios encontrados:\n");
            for (User user : users) {
                result.append("ID: ").append(user.getId())
                      .append(", Email: ").append(user.getEmail())
                      .append(", Nombre: ").append(user.getFirstName()).append(" ").append(user.getLastName())
                      .append(", Rol: ").append(user.getRole())
                      .append("\n");
            }
            return ResponseEntity.ok(result.toString());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
    
    /**
     * Obtener información de materias
     */
    @GetMapping("/subjects")
    public ResponseEntity<String> listSubjects() {
        try {
            List<Subject> subjects = subjectRepository.findAll();
            StringBuilder result = new StringBuilder();
            result.append("Materias encontradas:\n");
            for (Subject subject : subjects) {
                result.append("ID: ").append(subject.getId())
                      .append(", Nombre: ").append(subject.getName())
                      .append(", Color: ").append(subject.getColor())
                      .append("\n");
            }
            return ResponseEntity.ok(result.toString());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
}