-- Datos de prueba para el sistema de profesores
-- Ejecutar después de tener las tablas creadas

-- Insertar grados escolares
INSERT INTO school_grades (grade_name, grade_level, description, is_active, created_at, updated_at) VALUES
('10° A', 10, 'Décimo grado sección A', true, NOW(), NOW()),
('10° B', 10, 'Décimo grado sección B', true, NOW(), NOW()),
('10° C', 10, 'Décimo grado sección C', true, NOW(), NOW()),
('11° A', 11, 'Undécimo grado sección A', true, NOW(), NOW()),
('11° B', 11, 'Undécimo grado sección B', true, NOW(), NOW()),
('9° A', 9, 'Noveno grado sección A', true, NOW(), NOW()),
('9° B', 9, 'Noveno grado sección B', true, NOW(), NOW());

-- Insertar materias
INSERT INTO subjects (name, description, color, is_active, created_at, updated_at) VALUES
('Matemáticas', 'Matemáticas básicas y avanzadas', '#00368F', true, NOW(), NOW()),
('Física', 'Física general y aplicada', '#2E5BFF', true, NOW(), NOW()),
('Química', 'Química orgánica e inorgánica', '#00C764', true, NOW(), NOW()),
('Biología', 'Biología general y molecular', '#F5A623', true, NOW(), NOW()),
('Historia', 'Historia universal y nacional', '#FF6B35', true, NOW(), NOW()),
('Inglés', 'Idioma inglés', '#8B5CF6', true, NOW(), NOW()),
('Español', 'Lengua castellana y literatura', '#06B6D4', true, NOW(), NOW());

-- Insertar profesor de prueba (asumiendo que ya existe un usuario con ID 1 y rol TEACHER)
-- Si no existe, crear el usuario profesor
INSERT INTO users (email, password, first_name, last_name, role, school_grade_id, is_active, email_verified, created_at, updated_at) VALUES
('profesor@test.com', '$2a$10$example.hash.here', 'Juan Carlos', 'Rodríguez', 'TEACHER', NULL, true, true, NOW(), NOW())
ON DUPLICATE KEY UPDATE email = email;

-- Obtener IDs para las relaciones
SET @teacher_id = (SELECT id FROM users WHERE email = 'profesor@test.com' LIMIT 1);
SET @math_id = (SELECT id FROM subjects WHERE name = 'Matemáticas' LIMIT 1);
SET @physics_id = (SELECT id FROM subjects WHERE name = 'Física' LIMIT 1);
SET @chemistry_id = (SELECT id FROM subjects WHERE name = 'Química' LIMIT 1);
SET @grade_10a_id = (SELECT id FROM school_grades WHERE grade_name = '10° A' LIMIT 1);
SET @grade_10b_id = (SELECT id FROM school_grades WHERE grade_name = '10° B' LIMIT 1);
SET @grade_11a_id = (SELECT id FROM school_grades WHERE grade_name = '11° A' LIMIT 1);

-- Asignar materias al profesor
INSERT INTO teacher_subjects (teacher_id, subject_id, grade, period, created_at, updated_at) VALUES
(@teacher_id, @math_id, '10° A', '2024-2', NOW(), NOW()),
(@teacher_id, @math_id, '10° B', '2024-2', NOW(), NOW()),
(@teacher_id, @physics_id, '11° A', '2024-2', NOW(), NOW()),
(@teacher_id, @chemistry_id, '10° A', '2024-2', NOW(), NOW());

-- Insertar estudiantes de prueba
INSERT INTO users (email, password, first_name, last_name, role, school_grade_id, is_active, email_verified, created_at, updated_at) VALUES
('estudiante1@test.com', '$2a$10$example.hash.here', 'María', 'González', 'STUDENT', @grade_10a_id, true, true, NOW(), NOW()),
('estudiante2@test.com', '$2a$10$example.hash.here', 'Carlos', 'Pérez', 'STUDENT', @grade_10a_id, true, true, NOW(), NOW()),
('estudiante3@test.com', '$2a$10$example.hash.here', 'Ana', 'López', 'STUDENT', @grade_10b_id, true, true, NOW(), NOW()),
('estudiante4@test.com', '$2a$10$example.hash.here', 'Luis', 'Martínez', 'STUDENT', @grade_10b_id, true, true, NOW(), NOW()),
('estudiante5@test.com', '$2a$10$example.hash.here', 'Sofia', 'Ramírez', 'STUDENT', @grade_11a_id, true, true, NOW(), NOW()),
('estudiante6@test.com', '$2a$10$example.hash.here', 'Diego', 'Torres', 'STUDENT', @grade_11a_id, true, true, NOW(), NOW())
ON DUPLICATE KEY UPDATE email = email;

-- Crear plantillas de tareas
INSERT INTO task_templates (title, description, teacher_id, subject_id, grades, due_date, type, max_grade, created_at, updated_at) VALUES
('Ejercicios de Álgebra Lineal', 'Resolver los ejercicios del capítulo 5 sobre sistemas de ecuaciones lineales', @teacher_id, @math_id, '["10° A", "10° B"]', '2024-11-15', 'TRADITIONAL', 5.0, NOW(), NOW()),
('Laboratorio de Cinemática', 'Experimento sobre movimiento rectilíneo uniforme', @teacher_id, @physics_id, '["11° A"]', '2024-11-20', 'TRADITIONAL', 5.0, NOW(), NOW()),
('Balanceo de Ecuaciones Químicas', 'Práctica de balanceo de ecuaciones químicas básicas', @teacher_id, @chemistry_id, '["10° A"]', '2024-11-18', 'TRADITIONAL', 5.0, NOW(), NOW());

-- Crear tareas individuales para cada estudiante
-- Obtener IDs de estudiantes
SET @student1_id = (SELECT id FROM users WHERE email = 'estudiante1@test.com' LIMIT 1);
SET @student2_id = (SELECT id FROM users WHERE email = 'estudiante2@test.com' LIMIT 1);
SET @student3_id = (SELECT id FROM users WHERE email = 'estudiante3@test.com' LIMIT 1);
SET @student4_id = (SELECT id FROM users WHERE email = 'estudiante4@test.com' LIMIT 1);
SET @student5_id = (SELECT id FROM users WHERE email = 'estudiante5@test.com' LIMIT 1);
SET @student6_id = (SELECT id FROM users WHERE email = 'estudiante6@test.com' LIMIT 1);

-- Obtener ID de la primera plantilla de tarea
SET @template1_id = (SELECT id FROM task_templates WHERE title = 'Ejercicios de Álgebra Lineal' LIMIT 1);
SET @template2_id = (SELECT id FROM task_templates WHERE title = 'Laboratorio de Cinemática' LIMIT 1);
SET @template3_id = (SELECT id FROM task_templates WHERE title = 'Balanceo de Ecuaciones Químicas' LIMIT 1);

-- Tareas de Álgebra para 10° A y 10° B
INSERT INTO tasks (title, description, due_date, priority, status, subject_id, teacher_id, student_id, task_template_id, grade, max_grade, created_at, updated_at) VALUES
('Ejercicios de Álgebra Lineal', 'Resolver los ejercicios del capítulo 5 sobre sistemas de ecuaciones lineales', '2024-11-15', 'MEDIUM', 'SUBMITTED', @math_id, @teacher_id, @student1_id, @template1_id, '10° A', 5.0, NOW(), NOW()),
('Ejercicios de Álgebra Lineal', 'Resolver los ejercicios del capítulo 5 sobre sistemas de ecuaciones lineales', '2024-11-15', 'MEDIUM', 'PENDING', @math_id, @teacher_id, @student2_id, @template1_id, '10° A', 5.0, NOW(), NOW()),
('Ejercicios de Álgebra Lineal', 'Resolver los ejercicios del capítulo 5 sobre sistemas de ecuaciones lineales', '2024-11-15', 'MEDIUM', 'SUBMITTED', @math_id, @teacher_id, @student3_id, @template1_id, '10° B', 5.0, NOW(), NOW()),
('Ejercicios de Álgebra Lineal', 'Resolver los ejercicios del capítulo 5 sobre sistemas de ecuaciones lineales', '2024-11-15', 'MEDIUM', 'GRADED', @math_id, @teacher_id, @student4_id, @template1_id, '10° B', 5.0, NOW(), NOW());

-- Tareas de Física para 11° A
INSERT INTO tasks (title, description, due_date, priority, status, subject_id, teacher_id, student_id, task_template_id, grade, max_grade, created_at, updated_at) VALUES
('Laboratorio de Cinemática', 'Experimento sobre movimiento rectilíneo uniforme', '2024-11-20', 'HIGH', 'PENDING', @physics_id, @teacher_id, @student5_id, @template2_id, '11° A', 5.0, NOW(), NOW()),
('Laboratorio de Cinemática', 'Experimento sobre movimiento rectilíneo uniforme', '2024-11-20', 'HIGH', 'SUBMITTED', @physics_id, @teacher_id, @student6_id, @template2_id, '11° A', 5.0, NOW(), NOW());

-- Tareas de Química para 10° A
INSERT INTO tasks (title, description, due_date, priority, status, subject_id, teacher_id, student_id, task_template_id, grade, max_grade, created_at, updated_at) VALUES
('Balanceo de Ecuaciones Químicas', 'Práctica de balanceo de ecuaciones químicas básicas', '2024-11-18', 'MEDIUM', 'SUBMITTED', @chemistry_id, @teacher_id, @student1_id, @template3_id, '10° A', 5.0, NOW(), NOW()),
('Balanceo de Ecuaciones Químicas', 'Práctica de balanceo de ecuaciones químicas básicas', '2024-11-18', 'MEDIUM', 'PENDING', @chemistry_id, @teacher_id, @student2_id, @template3_id, '10° A', 5.0, NOW(), NOW());

-- Agregar entregas y calificaciones de ejemplo
UPDATE tasks SET 
    submission_text = 'He resuelto todos los ejercicios del capítulo 5. Los sistemas de ecuaciones se pueden resolver por eliminación gaussiana...',
    submitted_at = NOW(),
    status = 'SUBMITTED'
WHERE student_id = @student1_id AND title = 'Ejercicios de Álgebra Lineal';

UPDATE tasks SET 
    submission_text = 'Completé el experimento de cinemática. Los resultados muestran que la velocidad es constante en MRU...',
    submitted_at = NOW(),
    status = 'SUBMITTED'
WHERE student_id = @student6_id AND title = 'Laboratorio de Cinemática';

UPDATE tasks SET 
    submission_text = 'Balanceé todas las ecuaciones químicas usando el método algebraico...',
    submitted_at = NOW(),
    status = 'SUBMITTED'
WHERE student_id = @student1_id AND title = 'Balanceo de Ecuaciones Químicas';

-- Agregar una calificación de ejemplo
UPDATE tasks SET 
    score = 4.5,
    feedback = 'Excelente trabajo. Los procedimientos están bien explicados y los resultados son correctos.',
    graded_at = NOW(),
    status = 'GRADED'
WHERE student_id = @student4_id AND title = 'Ejercicios de Álgebra Lineal';

-- Verificar los datos insertados
SELECT 'Datos de prueba insertados correctamente' as mensaje;
SELECT COUNT(*) as total_teacher_subjects FROM teacher_subjects WHERE teacher_id = @teacher_id;
SELECT COUNT(*) as total_task_templates FROM task_templates WHERE teacher_id = @teacher_id;
SELECT COUNT(*) as total_tasks FROM tasks WHERE teacher_id = @teacher_id;
SELECT COUNT(*) as total_students FROM users WHERE role = 'STUDENT';