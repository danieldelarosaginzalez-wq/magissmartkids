-- Insertar grados escolares de ejemplo
-- Asegúrate de ejecutar esto en tu base de datos AltiusV3

USE AltiusV3;

-- Insertar grados si no existen
INSERT INTO school_grades (grade_name, grade_level, description, is_active, created_at, updated_at) 
VALUES 
    ('Primero', 1, 'Primer grado', true, NOW(), NOW()),
    ('Segundo', 2, 'Segundo grado', true, NOW(), NOW()),
    ('Tercero', 3, 'Tercer grado', true, NOW(), NOW()),
    ('Cuarto', 4, 'Cuarto grado', true, NOW(), NOW()),
    ('Quinto', 5, 'Quinto grado', true, NOW(), NOW()),
    ('Sexto', 6, 'Sexto grado', true, NOW(), NOW()),
    ('Séptimo', 7, 'Séptimo grado', true, NOW(), NOW()),
    ('Octavo', 8, 'Octavo grado', true, NOW(), NOW()),
    ('Noveno', 9, 'Noveno grado', true, NOW(), NOW()),
    ('Décimo', 10, 'Décimo grado', true, NOW(), NOW()),
    ('Undécimo', 11, 'Undécimo grado', true, NOW(), NOW()),
    ('Duodécimo', 12, 'Duodécimo grado', true, NOW(), NOW())
ON DUPLICATE KEY UPDATE 
    grade_name = VALUES(grade_name),
    updated_at = NOW();

-- Verificar los grados insertados
SELECT * FROM school_grades ORDER BY grade_level;
