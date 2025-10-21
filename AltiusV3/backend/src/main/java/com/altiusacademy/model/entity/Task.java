package com.altiusacademy.model.entity;

import java.time.LocalDate;
import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;

/**
 * Modelo MySQL para tareas tradicionales
 * Datos estructurados: título, descripción, fechas, calificaciones
 */
@Entity
@Table(name = "tasks")
public class Task {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, length = 200)
    private String title;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @Column(name = "due_date")
    private LocalDate dueDate;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TaskPriority priority = TaskPriority.MEDIUM;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TaskStatus status = TaskStatus.PENDING;
    
    // Tipo de tarea: multimedia (evidencias) o interactiva (quizzes)
    @Enumerated(EnumType.STRING)
    @Column(name = "task_type", nullable = false)
    private TaskType taskType = TaskType.MULTIMEDIA;
    
    // Configuración para tareas multimedia
    @Column(name = "allowed_formats", columnDefinition = "JSON")
    private String allowedFormats; // ["jpg", "png", "mp4", "pdf"]
    
    @Column(name = "max_files")
    private Integer maxFiles = 1;
    
    @Column(name = "max_size_mb")
    private Integer maxSizeMb = 10;
    
    // Configuración para tareas interactivas
    @Column(name = "activity_config", columnDefinition = "JSON")
    private String activityConfig; // {tipo: "quiz", preguntas: [], tiempo_limite: 30}
    
    @Column(name = "max_score")
    private Integer maxScore = 100;
    
    // Relaciones
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "subject_id")
    private Subject subject;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "teacher_id", nullable = false)
    private User teacher;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id")
    private User student;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "task_template_id")
    private TaskTemplate taskTemplate;
    
    @Column(name = "grade")
    private String grade; // Grado específico para esta tarea individual
    
    // Entrega del estudiante
    @Column(name = "submission_text", columnDefinition = "TEXT")
    private String submissionText;
    
    @Column(name = "submission_file_url")
    private String submissionFileUrl;
    
    @Column(name = "submitted_at")
    private LocalDateTime submittedAt;
    
    // Calificación
    @Column(name = "score")
    private Double score;
    
    @Column(name = "max_grade")
    private Double maxGrade = 5.0;
    
    @Column(name = "feedback", columnDefinition = "TEXT")
    private String feedback;
    
    @Column(name = "graded_at")
    private LocalDateTime gradedAt;
    
    // Auditoría
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    // Enums
    public enum TaskPriority {
        LOW, MEDIUM, HIGH
    }
    
    public enum TaskStatus {
        PENDING, IN_PROGRESS, SUBMITTED, GRADED, OVERDUE
    }
    
    public enum TaskType {
        MULTIMEDIA, // Para evidencias fotográficas, documentos, archivos
        INTERACTIVE // Para quizzes, ejercicios autocorregidos, actividades gamificadas
    }
    
    // Constructors
    public Task() {}
    
    public Task(String title, String description, LocalDate dueDate, User teacher) {
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.teacher = teacher;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getTitle() {
        return title;
    }
    
    public void setTitle(String title) {
        this.title = title;
    }
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    
    public LocalDate getDueDate() {
        return dueDate;
    }
    
    public void setDueDate(LocalDate dueDate) {
        this.dueDate = dueDate;
    }
    
    public TaskPriority getPriority() {
        return priority;
    }
    
    public void setPriority(TaskPriority priority) {
        this.priority = priority;
    }
    
    public TaskStatus getStatus() {
        return status;
    }
    
    public void setStatus(TaskStatus status) {
        this.status = status;
    }
    
    public Subject getSubject() {
        return subject;
    }
    
    public void setSubject(Subject subject) {
        this.subject = subject;
    }
    
    public User getTeacher() {
        return teacher;
    }
    
    public void setTeacher(User teacher) {
        this.teacher = teacher;
    }
    
    public User getStudent() {
        return student;
    }
    
    public void setStudent(User student) {
        this.student = student;
    }
    
    public String getSubmissionText() {
        return submissionText;
    }
    
    public void setSubmissionText(String submissionText) {
        this.submissionText = submissionText;
    }
    
    public String getSubmissionFileUrl() {
        return submissionFileUrl;
    }
    
    public void setSubmissionFileUrl(String submissionFileUrl) {
        this.submissionFileUrl = submissionFileUrl;
    }
    
    public LocalDateTime getSubmittedAt() {
        return submittedAt;
    }
    
    public void setSubmittedAt(LocalDateTime submittedAt) {
        this.submittedAt = submittedAt;
    }
    
    public Double getScore() {
        return score;
    }
    
    public void setScore(Double score) {
        this.score = score;
    }
    
    public Double getMaxGrade() {
        return maxGrade;
    }
    
    public void setMaxGrade(Double maxGrade) {
        this.maxGrade = maxGrade;
    }
    
    public String getFeedback() {
        return feedback;
    }
    
    public void setFeedback(String feedback) {
        this.feedback = feedback;
    }
    
    public LocalDateTime getGradedAt() {
        return gradedAt;
    }
    
    public void setGradedAt(LocalDateTime gradedAt) {
        this.gradedAt = gradedAt;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
    
    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
    
    public TaskTemplate getTaskTemplate() {
        return taskTemplate;
    }
    
    public void setTaskTemplate(TaskTemplate taskTemplate) {
        this.taskTemplate = taskTemplate;
    }
    
    public String getGrade() {
        return grade;
    }
    
    public void setGrade(String grade) {
        this.grade = grade;
    }
    
    public TaskType getTaskType() {
        return taskType;
    }
    
    public void setTaskType(TaskType taskType) {
        this.taskType = taskType;
    }
    
    public String getAllowedFormats() {
        return allowedFormats;
    }
    
    public void setAllowedFormats(String allowedFormats) {
        this.allowedFormats = allowedFormats;
    }
    
    public Integer getMaxFiles() {
        return maxFiles;
    }
    
    public void setMaxFiles(Integer maxFiles) {
        this.maxFiles = maxFiles;
    }
    
    public Integer getMaxSizeMb() {
        return maxSizeMb;
    }
    
    public void setMaxSizeMb(Integer maxSizeMb) {
        this.maxSizeMb = maxSizeMb;
    }
    
    public String getActivityConfig() {
        return activityConfig;
    }
    
    public void setActivityConfig(String activityConfig) {
        this.activityConfig = activityConfig;
    }
    
    public Integer getMaxScore() {
        return maxScore;
    }
    
    public void setMaxScore(Integer maxScore) {
        this.maxScore = maxScore;
    }
    
    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}