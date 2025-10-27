-- SISTEMA DE MATERIAS DE PRIMARIA
-- Insertar materias específicas por grado escolar

-- PREESCOLAR (school_grade_id = 1)
INSERT INTO subjects (name, description, institution_id, school_grade_id, is_active, color) VALUES
('Exploración del Medio', 'Conocimiento del entorno para preescolar', 1, 1, true, '#4CAF50'),
('Desarrollo del Lenguaje', 'Comunicación oral y escrita inicial', 1, 1, true, '#2196F3'),
('Expresión Artística', 'Arte, música y creatividad', 1, 1, true, '#FF9800'),
('Psicomotricidad', 'Desarrollo físico y coordinación', 1, 1, true, '#9C27B0');

-- PRIMERO (school_grade_id = 2)
INSERT INTO subjects (name, description, institution_id, school_grade_id, is_active, color) VALUES
('Matemáticas', 'Números, operaciones básicas y geometría', 1, 2, true, '#2E5BFF'),
('Lengua Española', 'Lectura, escritura y gramática básica', 1, 2, true, '#00C764'),
('Ciencias Naturales', 'Seres vivos y medio ambiente', 1, 2, true, '#F5A623'),
('Ciencias Sociales', 'Historia, geografía y civismo', 1, 2, true, '#FF6B35'),
('Inglés', 'Vocabulario básico y pronunciación', 1, 2, true, '#1494DE'),
('Educación Artística', 'Música, dibujo y teatro', 1, 2, true, '#E91E63'),
('Educación Física', 'Deportes y salud', 1, 2, true, '#795548');

-- SEGUNDO (school_grade_id = 3)
INSERT INTO subjects (name, description, institution_id, school_grade_id, is_active, color) VALUES
('Matemáticas', 'Números, operaciones y geometría', 1, 3, true, '#2E5BFF'),
('Lengua Española', 'Lectura, escritura y gramática', 1, 3, true, '#00C764'),
('Ciencias Naturales', 'Seres vivos y medio ambiente', 1, 3, true, '#F5A623'),
('Ciencias Sociales', 'Historia, geografía y civismo', 1, 3, true, '#FF6B35'),
('Inglés', 'Vocabulario básico', 1, 3, true, '#1494DE'),
('Educación Artística', 'Música, dibujo y teatro', 1, 3, true, '#E91E63'),
('Educación Física', 'Deportes y salud', 1, 3, true, '#795548');

-- TERCERO (school_grade_id = 4)
INSERT INTO subjects (name, description, institution_id, school_grade_id, is_active, color) VALUES
('Matemáticas', 'Números, operaciones y geometría', 1, 4, true, '#2E5BFF'),
('Lengua Española', 'Lectura, escritura y gramática', 1, 4, true, '#00C764'),
('Ciencias Naturales', 'Seres vivos y medio ambiente', 1, 4, true, '#F5A623'),
('Ciencias Sociales', 'Historia, geografía y civismo', 1, 4, true, '#FF6B35'),
('Inglés', 'Vocabulario básico', 1, 4, true, '#1494DE'),
('Educación Artística', 'Música, dibujo y teatro', 1, 4, true, '#E91E63'),
('Educación Física', 'Deportes y salud', 1, 4, true, '#795548');

-- CUARTO (school_grade_id = 5)
INSERT INTO subjects (name, description, institution_id, school_grade_id, is_active, color) VALUES
('Matemáticas', 'Números, operaciones y geometría', 1, 5, true, '#2E5BFF'),
('Lengua Española', 'Lectura, escritura y gramática', 1, 5, true, '#00C764'),
('Ciencias Naturales', 'Seres vivos y medio ambiente', 1, 5, true, '#F5A623'),
('Ciencias Sociales', 'Historia, geografía y civismo', 1, 5, true, '#FF6B35'),
('Inglés', 'Vocabulario básico', 1, 5, true, '#1494DE'),
('Educación Artística', 'Música, dibujo y teatro', 1, 5, true, '#E91E63'),
('Educación Física', 'Deportes y salud', 1, 5, true, '#795548');

-- QUINTO (school_grade_id = 6)
INSERT INTO subjects (name, description, institution_id, school_grade_id, is_active, color) VALUES
('Matemáticas', 'Números, operaciones y geometría', 1, 6, true, '#2E5BFF'),
('Lengua Española', 'Lectura, escritura y gramática', 1, 6, true, '#00C764'),
('Ciencias Naturales', 'Seres vivos y medio ambiente', 1, 6, true, '#F5A623'),
('Ciencias Sociales', 'Historia, geografía y civismo', 1, 6, true, '#FF6B35'),
('Inglés', 'Vocabulario básico', 1, 6, true, '#1494DE'),
('Educación Artística', 'Música, dibujo y teatro', 1, 6, true, '#E91E63'),
('Educación Física', 'Deportes y salud', 1, 6, true, '#795548');

-- ASIGNAR MATERIAS AL PROFESOR (ID: 3) EN teacher_subjects
-- Asumiendo que el profesor enseña en 5° A y 4° B
INSERT INTO teacher_subjects (teacher_id, subject_id, grade, period, is_active) VALUES
-- Quinto A (school_grade_id = 6)
(3, (SELECT id FROM subjects WHERE name = 'Matemáticas' AND school_grade_id = 6 LIMIT 1), '5° A', '2025-1', true),
(3, (SELECT id FROM subjects WHERE name = 'Lengua Española' AND school_grade_id = 6 LIMIT 1), '5° A', '2025-1', true),
(3, (SELECT id FROM subjects WHERE name = 'Ciencias Naturales' AND school_grade_id = 6 LIMIT 1), '5° A', '2025-1', true),

-- Cuarto B (school_grade_id = 5)
(3, (SELECT id FROM subjects WHERE name = 'Matemáticas' AND school_grade_id = 5 LIMIT 1), '4° B', '2025-1', true),
(3, (SELECT id FROM subjects WHERE name = 'Ciencias Sociales' AND school_grade_id = 5 LIMIT 1), '4° B', '2025-1', true),
(3, (SELECT id FROM subjects WHERE name = 'Inglés' AND school_grade_id = 5 LIMIT 1), '4° B', '2025-1', true);

-- Verificar las asignaciones
SELECT 
    ts.id,
    u.first_name as teacher_name,
    s.name as subject_name,
    ts.grade,
    sg.name as school_grade_name,
    ts.period
FROM teacher_subjects ts
JOIN users u ON ts.teacher_id = u.id
JOIN subjects s ON ts.subject_id = s.id
JOIN school_grades sg ON s.school_grade_id = sg.id
WHERE ts.teacher_id = 3 AND ts.is_active = true;