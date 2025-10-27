package com.altiusacademy.service;

import com.altiusacademy.dto.*;
import com.altiusacademy.model.entity.*;
import com.altiusacademy.repository.mysql.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ParentService {
    
    private static final Logger log = LoggerFactory.getLogger(ParentService.class);
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private TaskRepository taskRepository;
    
    @Autowired
    private SubjectRepository subjectRepository;
    
    public ParentDashboardStatsDto getDashboardStats(Long parentId) {
        try {
            // Obtener hijos del padre
            List<User> children = userRepository.findChildrenByParentId(parentId);
            
            int totalChildren = children.size();
            
            // Calcular total de materias de todos los hijos
            Set<Long> uniqueSubjects = new HashSet<>();
            for (User child : children) {
                List<Subject> childSubjects = subjectRepository.findByGrade(child.getSchoolGrade().getGradeName());
                uniqueSubjects.addAll(childSubjects.stream().map(Subject::getId).collect(Collectors.toSet()));
            }
            int totalSubjects = uniqueSubjects.size();
            
            // Calcular promedio general de todos los hijos
            double totalGradeSum = 0;
            int totalGradedTasks = 0;
            
            for (User child : children) {
                List<Task> childTasks = taskRepository.findByStudentAndStatus(child, Task.TaskStatus.GRADED);
                for (Task task : childTasks) {
                    if (task.getScore() != null) {
                        totalGradeSum += task.getScore();
                        totalGradedTasks++;
                    }
                }
            }
            
            double averageGrade = totalGradedTasks > 0 ? totalGradeSum / totalGradedTasks : 0.0;
            
            // Contar próximos eventos (tareas pendientes de todos los hijos)
            int upcomingTasks = 0;
            for (User child : children) {
                upcomingTasks += taskRepository.countByStudentAndStatus(child, Task.TaskStatus.PENDING).intValue();
            }
            
            ParentDashboardStatsDto stats = new ParentDashboardStatsDto();
            stats.setTotalChildren(totalChildren);
            stats.setTotalSubjects(totalSubjects);
            stats.setAverageGrade(averageGrade);
            stats.setUpcomingTasks(upcomingTasks);
            
            return stats;
            
        } catch (Exception e) {
            log.error("Error getting parent dashboard stats for parent {}: {}", parentId, e.getMessage());
            // Fallback data
            ParentDashboardStatsDto fallback = new ParentDashboardStatsDto();
            fallback.setTotalChildren(0);
            fallback.setTotalSubjects(0);
            fallback.setAverageGrade(0.0);
            fallback.setUpcomingTasks(0);
            return fallback;
        }
    }
    
    public List<ParentChildDto> getChildren(Long parentId) {
        try {
            List<User> children = userRepository.findChildrenByParentId(parentId);
            
            return children.stream()
                .map(child -> {
                    // Obtener materias del hijo
                    List<Subject> childSubjects = subjectRepository.findByGrade(child.getSchoolGrade().getGradeName());
                    
                    // Calcular promedio del hijo
                    List<Task> childTasks = taskRepository.findByStudentAndStatus(child, Task.TaskStatus.GRADED);
                    double childAverage = childTasks.stream()
                        .filter(task -> task.getScore() != null)
                        .mapToDouble(Task::getScore)
                        .average()
                        .orElse(0.0);
                    
                    // Crear DTOs de materias con calificaciones
                    List<ParentSubjectDto> subjects = childSubjects.stream()
                        .map(subject -> {
                            // TEMPORALMENTE COMENTADO - MÉTODO PROBLEMÁTICO
                            // List<Task> subjectTasks = taskRepository.findByStudentAndSubjectAndStatus(
                            //     child, subject, Task.TaskStatus.GRADED
                            // );
                            List<Task> subjectTasks = new ArrayList<>(); // Temporal
                            double subjectAverage = subjectTasks.stream()
                                .filter(task -> task.getScore() != null)
                                .mapToDouble(Task::getScore)
                                .average()
                                .orElse(0.0);
                            
                            ParentSubjectDto subjectDto = new ParentSubjectDto();
                            subjectDto.setName(subject.getName());
                            subjectDto.setGrade(subjectAverage);
                            return subjectDto;
                        })
                        .collect(Collectors.toList());
                    
                    ParentChildDto childDto = new ParentChildDto();
                    childDto.setId(child.getId().toString());
                    childDto.setFirstName(child.getFirstName());
                    childDto.setLastName(child.getLastName());
                    childDto.setGrade(child.getSchoolGrade().getGradeName());
                    childDto.setAverageGrade(childAverage);
                    childDto.setSubjects(subjects);
                    
                    return childDto;
                })
                .collect(Collectors.toList());
                
        } catch (Exception e) {
            log.error("Error getting children for parent {}: {}", parentId, e.getMessage());
            return new ArrayList<>();
        }
    }
    
    public List<ParentEventDto> getUpcomingEvents(Long parentId) {
        try {
            List<User> children = userRepository.findChildrenByParentId(parentId);
            List<ParentEventDto> events = new ArrayList<>();
            
            for (User child : children) {
                // TEMPORALMENTE COMENTADO - MÉTODO PROBLEMÁTICO
                // List<Task> pendingTasks = taskRepository.findByStudentAndStatusOrderByDueDate(
                //     child, Task.TaskStatus.PENDING
                // );
                List<Task> pendingTasks = new ArrayList<>(); // Temporal
                
                // Convertir a eventos
                for (Task task : pendingTasks.stream().limit(10).collect(Collectors.toList())) {
                    ParentEventDto event = new ParentEventDto();
                    event.setId(task.getId().toString());
                    event.setTitle("Tarea: " + task.getTitle());
                    event.setDescription(child.getFirstName() + " - " + child.getSchoolGrade().getGradeName());
                    event.setDate(task.getDueDate().toString());
                    event.setType("task");
                    event.setChildName(child.getFirstName());
                    events.add(event);
                }
            }
            
            // Ordenar por fecha
            events.sort((a, b) -> a.getDate().compareTo(b.getDate()));
            
            return events.stream().limit(5).collect(Collectors.toList());
            
        } catch (Exception e) {
            log.error("Error getting upcoming events for parent {}: {}", parentId, e.getMessage());
            return new ArrayList<>();
        }
    }
}