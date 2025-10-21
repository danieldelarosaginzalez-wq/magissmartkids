package com.altiusacademy.service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.stereotype.Service;

import com.altiusacademy.dto.StudentDashboardStatsDto;
import com.altiusacademy.dto.StudentGradeDto;
import com.altiusacademy.dto.StudentSubjectDto;
import com.altiusacademy.dto.StudentTaskDto;
import com.altiusacademy.model.entity.User;

@Service
public class StudentService {

    public StudentDashboardStatsDto getDashboardStats(String userEmail) {
        return new StudentDashboardStatsDto(6, 4, 12, 4.3, "18h 45m", 8);
    }

    public List<StudentTaskDto> getTasks(String userEmail, String status) {
        List<StudentTaskDto> tasks = new ArrayList<>();
        
        if (status == null || "pending".equals(status)) {
            tasks.addAll(Arrays.asList(
                new StudentTaskDto("1", "Ciencias", "Plantar un árbol", 
                    "Planta un árbol y documenta el proceso con fotos de cada paso", 
                    LocalDate.of(2025, 10, 22), "HIGH", "pending", "multimedia",
                    new String[]{"jpg", "png", "mp4"}, 5, 10, null, null, false, null),
                
                new StudentTaskDto("2", "Matemáticas", "Quiz de álgebra", 
                    "Responde las preguntas sobre ecuaciones lineales", 
                    LocalDate.of(2025, 10, 25), "MEDIUM", "pending", "interactive",
                    null, null, null, "{\"tipo\":\"quiz\",\"preguntas\":5,\"tiempo\":30}", 100, false, null)
            ));
        }

        return tasks;
    }

    public List<StudentSubjectDto> getSubjectsProgress(String userEmail) {
        return Arrays.asList(
            new StudentSubjectDto("1", "Matemáticas", 85, 4.5, "#2E5BFF"),
            new StudentSubjectDto("2", "Ciencias", 72, 4.2, "#00C764"),
            new StudentSubjectDto("3", "Historia", 90, 4.8, "#F5A623")
        );
    }

    public List<StudentGradeDto> getRecentGrades(String userEmail, int limit) {
        List<StudentGradeDto> allGrades = Arrays.asList(
            new StudentGradeDto("1", "Matemáticas", "Quiz Álgebra", 4.5, 5.0, LocalDate.of(2025, 10, 18)),
            new StudentGradeDto("2", "Ciencias", "Examen Química", 4.2, 5.0, LocalDate.of(2025, 10, 17))
        );

        return allGrades.subList(0, Math.min(limit, allGrades.size()));
    }
    
    public void submitMultimediaTask(String taskId, List<org.springframework.web.multipart.MultipartFile> files, 
                                   String submissionText, String userEmail) {
        System.out.println("Multimedia task submitted: " + taskId + " with " + files.size() + " files");
    }
    
    public String startInteractiveTask(String taskId, String userEmail) {
        return "{\"tipo\":\"quiz\",\"titulo\":\"Quiz de Matemáticas\"}";
    }
    
    public void completeInteractiveTask(String taskId, String answers, String userEmail) {
        System.out.println("Interactive task completed: " + taskId);
    }
    
    public List<User> getStudentsByInstitution(Long institutionId) {
        return new ArrayList<>();
    }
    
    public User createStudent(User student, Long institutionId) {
        student.setId(System.currentTimeMillis());
        return student;
    }
    
    public User updateStudent(Long studentId, User student, Long institutionId) {
        student.setId(studentId);
        return student;
    }
    
    public void deleteStudent(Long studentId, Long institutionId) {
        System.out.println("Student with ID " + studentId + " deleted from institution " + institutionId);
    }
}