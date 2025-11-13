-- Tabla para relacionar profesores con grados específicos (1A, 1B, 2C, etc.)
CREATE TABLE IF NOT EXISTS teacher_grades (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    teacher_id BIGINT NOT NULL,
    grade_level INT NOT NULL,
    section VARCHAR(1) NOT NULL,
    institution_id BIGINT,
    is_active BOOLEAN DEFAULT TRUE,
    academic_year VARCHAR(10),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_teacher_grades_teacher FOREIGN KEY (teacher_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_teacher_grades_institution FOREIGN KEY (institution_id) REFERENCES institutions(id) ON DELETE SET NULL,
    CONSTRAINT uk_teacher_grade_section UNIQUE (teacher_id, grade_level, section),
    CONSTRAINT chk_section CHECK (section IN ('A', 'B', 'C', 'D')),
    CONSTRAINT chk_grade_level CHECK (grade_level BETWEEN 1 AND 12)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Índices para mejorar el rendimiento
CREATE INDEX idx_teacher_grades_teacher ON teacher_grades(teacher_id);
CREATE INDEX idx_teacher_grades_institution ON teacher_grades(institution_id);
CREATE INDEX idx_teacher_grades_level ON teacher_grades(grade_level);
CREATE INDEX idx_teacher_grades_active ON teacher_grades(is_active);
