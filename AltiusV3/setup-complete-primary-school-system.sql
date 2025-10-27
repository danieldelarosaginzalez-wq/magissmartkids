-- SISTEMA COMPLETO DE PRIMARIA CON MÚLTIPLES GRUPOS
-- Limpiar asignaciones anteriores del profesor 3 (usando id para evitar safe mode)
DELETE FROM teacher_subjects WHERE teacher_id = 3 AND id > 0;

-- ASIGNAR MATERIAS AL PROFESOR EN MÚLTIPLES GRUPOS
-- El profesor enseñará en varios grados y grupos diferentes

-- PREESCOLAR A - Todas las materias
INSERT INTO teacher_subjects (teacher_id, subject_id, grade, period, is_active) VALUES
(3, (SELECT id FROM subjects WHERE name = 'Exploración del Medio' AND school_grade_id = 1 LIMIT 1), 'Preescolar A', '2025-1', true),
(3, (SELECT id FROM subjects WHERE name = 'Desarrollo del Lenguaje' AND school_grade_id = 1 LIMIT 1), 'Preescolar A', '2025-1', true),

-- PRIMERO B - Materias básicas
(3, (SELECT id FROM subjects WHERE name = 'Matemáticas' AND school_grade_id = 2 LIMIT 1), '1° B', '2025-1', true),
(3, (SELECT id FROM subjects WHERE name = 'Lengua Española' AND school_grade_id = 2 LIMIT 1), '1° B', '2025-1', true),

-- SEGUNDO C - Ciencias
(3, (SELECT id FROM subjects WHERE name = 'Ciencias Naturales' AND school_grade_id = 3 LIMIT 1), '2° C', '2025-1', true),
(3, (SELECT id FROM subjects WHERE name = 'Ciencias Sociales' AND school_grade_id = 3 LIMIT 1), '2° C', '2025-1', true),

-- TERCERO A - Matemáticas e Inglés
(3, (SELECT id FROM subjects WHERE name = 'Matemáticas' AND school_grade_id = 4 LIMIT 1), '3° A', '2025-1', true),
(3, (SELECT id FROM subjects WHERE name = 'Inglés' AND school_grade_id = 4 LIMIT 1), '3° A', '2025-1', true),

-- CUARTO D - Artística y Física
(3, (SELECT id FROM subjects WHERE name = 'Educación Artística' AND school_grade_id = 5 LIMIT 1), '4° D', '2025-1', true),
(3, (SELECT id FROM subjects WHERE name = 'Educación Física' AND school_grade_id = 5 LIMIT 1), '4° D', '2025-1', true),

-- QUINTO A - Materias principales
(3, (SELECT id FROM subjects WHERE name = 'Matemáticas' AND school_grade_id = 6 LIMIT 1), '5° A', '2025-1', true),
(3, (SELECT id FROM subjects WHERE name = 'Lengua Española' AND school_grade_id = 6 LIMIT 1), '5° A', '2025-1', true),
(3, (SELECT id FROM subjects WHERE name = 'Ciencias Naturales' AND school_grade_id = 6 LIMIT 1), '5° A', '2025-1', true),

-- QUINTO B - Materias complementarias
(3, (SELECT id FROM subjects WHERE name = 'Ciencias Sociales' AND school_grade_id = 6 LIMIT 1), '5° B', '2025-1', true),
(3, (SELECT id FROM subjects WHERE name = 'Inglés' AND school_grade_id = 6 LIMIT 1), '5° B', '2025-1', true);

-- Verificar las nuevas asignaciones
SELECT 
    ts.id,
    s.name as subject_name,
    ts.grade,
    s.school_grade_id,
    ts.period,
    s.color
FROM teacher_subjects ts
JOIN subjects s ON ts.subject_id = s.id
WHERE ts.teacher_id = 3 AND ts.is_active = true
ORDER BY ts.grade, s.name;

-- Contar total de asignaciones
SELECT COUNT(*) as total_assignments FROM teacher_subjects WHERE teacher_id = 3 AND is_active = true;