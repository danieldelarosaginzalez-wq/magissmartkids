-- ============================================
-- DIAGNÓSTICO: Profesor sin estudiantes visibles
-- ============================================

-- 1. Ver información del profesor (buscar por email o nombre)
SELECT 
    id,
    email,
    first_name,
    last_name,
    role,
    institution_id,
    school_grade_id
FROM users 
WHERE role = 'TEACHER' 
  AND (email LIKE '%profesor%' OR first_name LIKE '%dadada%')
ORDER BY id DESC
LIMIT 5;

-- 2. Ver las materias del profesor (reemplaza 'TEACHER_ID' con el ID del paso 1)
SELECT 
    s.id as subject_id,
    s.name as subject_name,
    s.school_grade_id,
    sg.grade_name,
    sg.grade_level,
    s.teacher_id,
    s.is_active,
    s.institution_id
FROM subjects s
LEFT JOIN school_grades sg ON s.school_grade_id = sg.id
WHERE s.teacher_id = 'TEACHER_ID'  -- REEMPLAZAR CON ID DEL PROFESOR
ORDER BY s.id;

-- 3. Ver estudiantes que DEBERÍAN ver las materias del profesor
SELECT 
    u.id as student_id,
    u.first_name,
    u.last_name,
    u.email,
    u.school_grade_id,
    sg.grade_name as student_grade,
    sg.grade_level
FROM users u
LEFT JOIN school_grades sg ON u.school_grade_id = sg.id
WHERE u.role = 'STUDENT'
  AND u.school_grade_id IN (
      SELECT DISTINCT s.school_grade_id 
      FROM subjects s 
      WHERE s.teacher_id = 'TEACHER_ID'  -- REEMPLAZAR CON ID DEL PROFESOR
  )
ORDER BY u.id;

-- 4. Ver la conexión completa: Profesor -> Materias -> Grado -> Estudiantes
SELECT 
    t.id as teacher_id,
    CONCAT(t.first_name, ' ', t.last_name) as teacher_name,
    s.id as subject_id,
    s.name as subject_name,
    sg.id as grade_id,
    sg.grade_name,
    sg.grade_level,
    COUNT(DISTINCT u.id) as total_students
FROM users t
INNER JOIN subjects s ON s.teacher_id = t.id
LEFT JOIN school_grades sg ON s.school_grade_id = sg.id
LEFT JOIN users u ON u.school_grade_id = sg.id AND u.role = 'STUDENT'
WHERE t.role = 'TEACHER'
  AND t.id = 'TEACHER_ID'  -- REEMPLAZAR CON ID DEL PROFESOR
GROUP BY t.id, t.first_name, t.last_name, s.id, s.name, sg.id, sg.grade_name, sg.grade_level
ORDER BY s.id;

-- 5. DIAGNÓSTICO: Problemas comunes

-- 5a. Materias sin school_grade_id (PROBLEMA)
SELECT 
    s.id,
    s.name,
    s.teacher_id,
    s.school_grade_id,
    'Materia sin grado asignado' as problema
FROM subjects s
WHERE s.teacher_id = 'TEACHER_ID'  -- REEMPLAZAR
  AND s.school_grade_id IS NULL;

-- 5b. Estudiantes sin school_grade_id (PROBLEMA)
SELECT 
    u.id,
    u.first_name,
    u.last_name,
    u.email,
    u.school_grade_id,
    'Estudiante sin grado asignado' as problema
FROM users u
WHERE u.role = 'STUDENT'
  AND u.school_grade_id IS NULL;

-- 5c. Grados que no coinciden
SELECT 
    s.id as subject_id,
    s.name as subject_name,
    s.school_grade_id as subject_grade_id,
    sg1.grade_name as subject_grade_name,
    u.id as student_id,
    u.first_name as student_name,
    u.school_grade_id as student_grade_id,
    sg2.grade_name as student_grade_name,
    'Grados no coinciden' as problema
FROM subjects s
INNER JOIN school_grades sg1 ON s.school_grade_id = sg1.id
CROSS JOIN users u
LEFT JOIN school_grades sg2 ON u.school_grade_id = sg2.id
WHERE s.teacher_id = 'TEACHER_ID'  -- REEMPLAZAR
  AND u.role = 'STUDENT'
  AND s.school_grade_id != u.school_grade_id;

-- 6. Ver TODOS los grados disponibles
SELECT 
    id,
    grade_name,
    grade_level,
    description
FROM school_grades
ORDER BY grade_level, grade_name;

-- 7. Ver estudiantes por grado
SELECT 
    sg.id as grade_id,
    sg.grade_name,
    sg.grade_level,
    COUNT(u.id) as total_students,
    GROUP_CONCAT(CONCAT(u.first_name, ' ', u.last_name) SEPARATOR ', ') as students
FROM school_grades sg
LEFT JOIN users u ON u.school_grade_id = sg.id AND u.role = 'STUDENT'
GROUP BY sg.id, sg.grade_name, sg.grade_level
ORDER BY sg.grade_level;

-- 8. Ver materias por grado
SELECT 
    sg.id as grade_id,
    sg.grade_name,
    sg.grade_level,
    COUNT(s.id) as total_subjects,
    GROUP_CONCAT(s.name SEPARATOR ', ') as subjects
FROM school_grades sg
LEFT JOIN subjects s ON s.school_grade_id = sg.id AND s.is_active = true
GROUP BY sg.id, sg.grade_name, sg.grade_level
ORDER BY sg.grade_level;

-- ============================================
-- SOLUCIONES RÁPIDAS
-- ============================================

-- SOLUCIÓN 1: Asignar grado a las materias del profesor
-- (Primero identifica el grade_id correcto del paso 6)
/*
UPDATE subjects 
SET school_grade_id = 'GRADE_ID'  -- ID del grado correcto
WHERE teacher_id = 'TEACHER_ID'
  AND school_grade_id IS NULL;
*/

-- SOLUCIÓN 2: Asignar grado a los estudiantes
-- (Asignar al mismo grado que las materias)
/*
UPDATE users 
SET school_grade_id = 'GRADE_ID'  -- Mismo ID que las materias
WHERE role = 'STUDENT'
  AND school_grade_id IS NULL;
*/

-- SOLUCIÓN 3: Verificar que las materias estén activas
/*
UPDATE subjects 
SET is_active = true
WHERE teacher_id = 'TEACHER_ID';
*/

-- ============================================
-- VERIFICACIÓN FINAL
-- ============================================

-- Después de aplicar las soluciones, ejecuta esto:
SELECT 
    'Profesor' as tipo,
    t.id,
    CONCAT(t.first_name, ' ', t.last_name) as nombre,
    NULL as grado,
    COUNT(DISTINCT s.id) as materias,
    COUNT(DISTINCT u.id) as estudiantes
FROM users t
LEFT JOIN subjects s ON s.teacher_id = t.id AND s.is_active = true
LEFT JOIN users u ON u.school_grade_id = s.school_grade_id AND u.role = 'STUDENT'
WHERE t.id = 'TEACHER_ID'  -- REEMPLAZAR
GROUP BY t.id, t.first_name, t.last_name

UNION ALL

SELECT 
    'Estudiante' as tipo,
    u.id,
    CONCAT(u.first_name, ' ', u.last_name) as nombre,
    sg.grade_name as grado,
    COUNT(DISTINCT s.id) as materias,
    NULL as estudiantes
FROM users u
LEFT JOIN school_grades sg ON u.school_grade_id = sg.id
LEFT JOIN subjects s ON s.school_grade_id = u.school_grade_id AND s.is_active = true AND s.teacher_id IS NOT NULL
WHERE u.role = 'STUDENT'
  AND u.school_grade_id IN (
      SELECT DISTINCT school_grade_id 
      FROM subjects 
      WHERE teacher_id = 'TEACHER_ID'  -- REEMPLAZAR
  )
GROUP BY u.id, u.first_name, u.last_name, sg.grade_name;
