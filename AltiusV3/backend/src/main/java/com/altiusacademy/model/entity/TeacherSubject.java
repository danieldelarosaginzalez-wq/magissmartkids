package com.altiusacademy.model.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "teacher_subjects")
public class TeacherSubject {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "teacher_id", nullable = false)
    private Long teacherId;
    
    @Column(name = "subject_id", nullable = false)
    private Long subjectId;
    
    @Column(name = "grade", nullable = false, length = 20)
    private String grade; // "10° A", "10° B", "11° A"
    
    @Column(name = "period", length = 10)
    private String period;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "subject_id", insertable = false, updatable = false)
    private Subject subject;
    
    // Constructors
    public TeacherSubject() {}
    
    public TeacherSubject(Long teacherId, Long subjectId, String grade, String period) {
        this.teacherId = teacherId;
        this.subjectId = subjectId;
        this.grade = grade;
        this.period = period;
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Long getTeacherId() { return teacherId; }
    public void setTeacherId(Long teacherId) { this.teacherId = teacherId; }
    
    public Long getSubjectId() { return subjectId; }
    public void setSubjectId(Long subjectId) { this.subjectId = subjectId; }
    
    public String getGrade() { return grade; }
    public void setGrade(String grade) { this.grade = grade; }
    
    public String getPeriod() { return period; }
    public void setPeriod(String period) { this.period = period; }
    
    public Subject getSubject() { return subject; }
    public void setSubject(Subject subject) { this.subject = subject; }
}