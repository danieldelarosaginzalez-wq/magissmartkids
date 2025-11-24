-- Agregar más grados a la institución 1
USE AltiusV3;

-- Insertar grados adicionales para la institución 1
INSERT INTO teacher_grades (grade_level, section, academic_year, is_active, institution_id, teacher_id, created_at, updated_at)
VALUES
    (1, 'A', '2025', 1, 1, 8, NOW(), NOW()),
    (2, 'A', '2025', 1, 1, 8, NOW(), NOW()),
    (2, 'B', '2025', 1, 1, 8, NOW(), NOW()),
    (3, 'A', '2025', 1, 1, 8, NOW(), NOW()),
    (4, 'A', '2025', 1, 1, 8, NOW(), NOW()),
    (5, 'A', '2025', 1, 1, 8, NOW(), NOW())
ON DUPLICATE KEY UPDATE updated_at = NOW();

-- Verificar los grados insertados
SELECT tg.id, tg.grade_level, tg.section, tg.academic_year, tg.institution_id, tg.teacher_id
FROM teacher_grades tg
WHERE tg.institution_id = 1
ORDER BY tg.grade_level, tg.section;
