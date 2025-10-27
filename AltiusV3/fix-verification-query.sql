-- Verificar estructura de school_grades
DESCRIBE school_grades;

-- Consulta corregida para verificar las asignaciones
SELECT 
    ts.id,
    u.first_name as teacher_name,
    s.name as subject_name,
    ts.grade,
    s.school_grade_id,
    ts.period,
    ts.is_active
FROM teacher_subjects ts
JOIN users u ON ts.teacher_id = u.id
JOIN subjects s ON ts.subject_id = s.id
WHERE ts.teacher_id = 3 AND ts.is_active = true;

-- Consulta alternativa más simple
SELECT 
    ts.id,
    ts.teacher_id,
    s.name as subject_name,
    ts.grade,
    ts.period
FROM teacher_subjects ts
JOIN subjects s ON ts.subject_id = s.id
WHERE ts.teacher_id = 3 AND ts.is_active = true;