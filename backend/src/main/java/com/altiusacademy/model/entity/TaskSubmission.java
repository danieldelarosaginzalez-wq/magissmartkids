package com.altiusacademy.model.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "task_submissions")
public class TaskSubmission {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "task_id", nullable = false)
    private Task task;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private User student;
    
    // Para tareas multimedia
    @Column(name = "attached_files", columnDefinition = "JSON")
    private String attachedFiles; // [{url: "", nombre: "", tipo: "image/jpeg"}]
    
    @Column(name = "submission_text", columnDefinition = "TEXT")
    private String submissionText;
    
    // Para tareas interactivas
    @Column(name = "answers", columnDefinition = "JSON")
    private String answers; // {pregunta1: "respuesta", pregunta2: "A"}
    
    @Column(name = "score_obtained")
    private Integer scoreObtained;
    
    @Column(name = "completed_at")
    private LocalDateTime completedAt;
    
    // Común
    @Column(name = "submitted_at", nullable = false)
    private LocalDateTime submittedAt = LocalDateTime.now();
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SubmissionStatus status = SubmissionStatus.SUBMITTED;
    
    @Column(name = "grade")
    private Double grade;
    
    @Column(name = "feedback", columnDefinition = "TEXT")
    private String feedback;
    
    @Column(name = "graded_at")
    private LocalDateTime gradedAt;
    
    // Enum para estado de entrega
    public enum SubmissionStatus {
        SUBMITTED, GRADED, RETURNED
    }
    
    // Constructors
    public TaskSubmission() {}
    
    public TaskSubmission(Task task, User student) {
        this.task = task;
        this.student = student;
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Task getTask() { return task; }
    public void setTask(Task task) { this.task = task; }
    
    public User getStudent() { return student; }
    public void setStudent(User student) { this.student = student; }
    
    public String getAttachedFiles() { return attachedFiles; }
    public void setAttachedFiles(String attachedFiles) { this.attachedFiles = attachedFiles; }
    
    public String getSubmissionText() { return submissionText; }
    public void setSubmissionText(String submissionText) { this.submissionText = submissionText; }
    
    public String getAnswers() { return answers; }
    public void setAnswers(String answers) { this.answers = answers; }
    
    public Integer getScoreObtained() { return scoreObtained; }
    public void setScoreObtained(Integer scoreObtained) { this.scoreObtained = scoreObtained; }
    
    public LocalDateTime getCompletedAt() { return completedAt; }
    public void setCompletedAt(LocalDateTime completedAt) { this.completedAt = completedAt; }
    
    public LocalDateTime getSubmittedAt() { return submittedAt; }
    public void setSubmittedAt(LocalDateTime submittedAt) { this.submittedAt = submittedAt; }
    
    public SubmissionStatus getStatus() { return status; }
    public void setStatus(SubmissionStatus status) { this.status = status; }
    
    public Double getGrade() { return grade; }
    public void setGrade(Double grade) { this.grade = grade; }
    
    public String getFeedback() { return feedback; }
    public void setFeedback(String feedback) { this.feedback = feedback; }
    
    public LocalDateTime getGradedAt() { return gradedAt; }
    public void setGradedAt(LocalDateTime gradedAt) { this.gradedAt = gradedAt; }
}