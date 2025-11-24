-- ============================================
-- Script de Prueba: Asignación Estudiantes-Materias
-- ============================================

-- 1. Ver todos los estudiantes y sus grados
SELECT 
    u.id,
    u.first_name,
    u.last_name,
    u.email,
    u.role,
    u.school_grade_id,
    sg.grade_name,
    sg.grade_level
FROM users u
LEFT JOIN school_grades sg ON u.school_grade_id = sg.id
WHERE u.role = 'STUDENT'
ORDER BY u.id;

-- 2. Ver todas las materias y sus grados
SELECT 
    s.id,
    s.name as subject_name,
    s.school_grade_id,
    sg.grade_name,
    s.teacher_id,
    CONCAT(t.first_name, ' ', t.last_name) as teacher_name,
    s.is_active
FROM subjects s
LEFT JOIN school_grades sg ON s.school_grade_id = sg.id
LEFT JOIN users t ON s.teacher_id = t.id
ORDER BY sg.grade_level, s.name;

-- 3. Ver la relación completa: Estudiantes -> Grados -> Materias -> Profesores
SELECT 
    u.id as student_id,
    CONCAT(u.first_name, ' ', u.last_name) as student_name,
    u.email as student_email,
    sg.grade_name as student_grade,
    s.id as subject_id,
    s.name as subject_name,
    s.color as subject_color,
    t.id as teacher_id,
    CONCAT(t.first_name, ' ', t.last_name) as teacher_name,
    t.email as teacher_email
FROM users u
INNER JOIN school_grades sg ON u.school_grade_id = sg.id
INNER JOIN subjects s ON s.school_grade_id = sg.id
LEFT JOIN users t ON s.teacher_id = t.id
WHERE u.role = 'STUDENT'
  AND s.is_active = true
  AND s.teacher_id IS NOT NULL
ORDER BY u.id, s.name;

-- 4. Contar materias por estudiante
SELECT 
    u.id as student_id,
    CONCAT(u.first_name, ' ', u.last_name) as student_name,
    sg.grade_name,
    COUNT(s.id) as total_subjects
FROM users u
INNER JOIN school_grades sg ON u.school_grade_id = sg.id
LEFT JOIN subjects s ON s.school_grade_id = sg.id AND s.teacher_id IS NOT NULL AND s.is_active = true
WHERE u.role = 'STUDENT'
GROUP BY u.id, u.first_name, u.last_name, sg.grade_name
ORDER BY u.id;

-- 5. Ver estudiantes SIN grado asignado (problema potencial)
SELECT 
    u.id,
    u.first_name,
    u.last_name,
    u.email,
    u.school_grade_id
FROM users u
WHERE u.role = 'STUDENT'
  AND u.school_grade_id IS NULL;

-- 6. Ver materias SIN profesor asignado (no visibles para estudiantes)
SELECT 
    s.id,
    s.name,
    sg.grade_name,
    s.teacher_id,
    s.is_active
FROM subjects s
LEFT JOIN school_grades sg ON s.school_grade_id = sg.id
WHERE s.teacher_id IS NULL
  AND s.is_active = true;

-- 7. Ver materias de un estudiante específico (reemplaza 5 con el ID del estudiante)
SELECT 
    s.id,
    s.name as subject_name,
    s.color,
    sg.grade_name,
    CONCAT(t.first_name, ' ', t.last_name) as teacher_name,
    t.email as teacher_email
FROM users u
INNER JOIN school_grades sg ON u.school_grade_id = sg.id
INNER JOIN subjects s ON s.school_grade_id = sg.id
INNER JOIN users t ON s.teacher_id = t.id
WHERE u.id = 5  -- Cambiar por el ID del estudiante que quieres probar
  AND u.role = 'STUDENT'
  AND s.is_active = true;

-- 8. Ver tareas de las materias de un estudiante específico
SELECT 
    t.id as task_id,
    t.title as task_title,
    t.description,
    t.due_date,
    t.status,
    s.id as subject_id,
    s.name as subject_name,
    s.color as subject_color
FROM users u
INNER JOIN school_grades sg ON u.school_grade_id = sg.id
INNER JOIN subjects s ON s.school_grade_id = sg.id
INNER JOIN tasks t ON t.subject_id = s.id
WHERE u.id = 5  -- Cambiar por el ID del estudiante
  AND u.role = 'STUDENT'
  AND s.is_active = true
  AND s.teacher_id IS NOT NULL
ORDER BY t.due_date DESC;

-- 9. Estadísticas por grado
SELECT 
    sg.id,
    sg.grade_name,
    sg.grade_level,
    COUNT(DISTINCT u.id) as total_students,
    COUNT(DISTINCT s.id) as total_subjects,
    COUNT(DISTINCT s.teacher_id) as total_teachers
FROM school_grades sg
LEFT JOIN users u ON u.school_grade_id = sg.id AND u.role = 'STUDENT'
LEFT JOIN subjects s ON s.school_grade_id = sg.id AND s.is_active = true
GROUP BY sg.id, sg.grade_name, sg.grade_level
ORDER BY sg.grade_level;

-- 10. Verificar integridad de datos
-- Estudiantes sin grado
SELECT 'Estudiantes sin grado' as issue, COUNT(*) as count
FROM users 
WHERE role = 'STUDENT' AND school_grade_id IS NULL

UNION ALL

-- Materias sin grado
SELECT 'Materias sin grado' as issue, COUNT(*) as count
FROM subjects 
WHERE school_grade_id IS NULL AND is_active = true

UNION ALL

-- Materias sin profesor
SELECT 'Materias sin profesor' as issue, COUNT(*) as count
FROM subjects 
WHERE teacher_id IS NULL AND is_active = true

UNION ALL

-- Grados sin estudiantes
SELECT 'Grados sin estudiantes' as issue, COUNT(*) as count
FROM school_grades sg
WHERE NOT EXISTS (
    SELECT 1 FROM users u 
    WHERE u.school_grade_id = sg.id AND u.role = 'STUDENT'
)

UNION ALL

-- Grados sin materias
SELECT 'Grados sin materias' as issue, COUNT(*) as count
FROM school_grades sg
WHERE NOT EXISTS (
    SELECT 1 FROM subjects s 
    WHERE s.school_grade_id = sg.id AND s.is_active = true
);

-- ============================================
-- Scripts de Corrección (si es necesario)
-- ============================================

-- Asignar grado a un estudiante
-- UPDATE users SET school_grade_id = 1 WHERE id = 5;

-- Asignar profesor a una materia
-- UPDATE subjects SET teacher_id = 10 WHERE id = 1;

-- Activar una materia
-- UPDATE subjects SET is_active = true WHERE id = 1;

-- ============================================
-- Scripts de Prueba de Datos
-- ============================================

-- Crear un estudiante de prueba (si no existe)
/*
INSERT INTO users (email, password, first_name, last_name, role, school_grade_id, is_active)
VALUES ('estudiante.prueba@test.com', '$2a$10$...', 'Estudiante', 'Prueba', 'STUDENT', 1, true);
*/

-- Crear una materia de prueba (si no existe)
/*
INSERT INTO subjects (name, description, color, school_grade_id, teacher_id, institution_id, is_active)
VALUES ('Matemáticas Prueba', 'Materia de prueba', '#2E5BFF', 1, 10, 1, true);
*/

-- Crear una tarea de prueba (si no existe)
/*
INSERT INTO tasks (title, description, subject_id, teacher_id, grade, due_date, status, created_at)
VALUES ('Tarea de Prueba', 'Descripción de prueba', 1, 10, 'Quinto A', '2025-12-31 23:59:59', 'PENDING', NOW());
*/
