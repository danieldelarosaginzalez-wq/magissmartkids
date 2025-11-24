-- Verificar grados en la base de datos
SELECT * FROM school_grades;

-- Si no hay grados, insertar algunos de ejemplo
INSERT INTO school_grades (grade_name, grade_level, description, is_active) 
VALUES 
    ('Primero A', 1, 'Primer grado sección A', true),
    ('Segundo A', 2, 'Segundo grado sección A', true),
    ('Tercero A', 3, 'Tercer grado sección A', true),
    ('Cuarto A', 4, 'Cuarto grado sección A', true),
    ('Quinto A', 5, 'Quinto grado sección A', true),
    ('Sexto A', 6, 'Sexto grado sección A', true)
ON DUPLICATE KEY UPDATE grade_name = grade_name;

SELECT * FROM school_grades;
