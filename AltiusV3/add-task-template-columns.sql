-- Script para agregar columnas de configuración multimedia e interactiva a task_templates
-- Ejecutar este script en la base de datos MySQL

USE altius_academy;

-- Agregar columnas para configuración multimedia
ALTER TABLE task_templates 
ADD COLUMN allowed_formats JSON COMMENT 'Formatos permitidos para archivos multimedia',
ADD COLUMN max_files INT DEFAULT 1 COMMENT 'Número máximo de archivos permitidos',
ADD COLUMN max_size_mb INT DEFAULT 10 COMMENT 'Tamaño máximo en MB por archivo';

-- Agregar columnas para configuración interactiva
ALTER TABLE task_templates 
ADD COLUMN activity_config JSON COMMENT 'Configuración para actividades interactivas (quizzes, etc.)',
ADD COLUMN max_score INT DEFAULT 100 COMMENT 'Puntaje máximo para actividades interactivas';

-- Actualizar el enum de TaskType para incluir MULTIMEDIA
ALTER TABLE task_templates 
MODIFY COLUMN type ENUM('TRADITIONAL', 'INTERACTIVE', 'MULTIMEDIA') NOT NULL DEFAULT 'TRADITIONAL';

-- Verificar que las columnas se agregaron correctamente
DESCRIBE task_templates;

-- Insertar algunos datos de ejemplo para testing
INSERT INTO task_templates (
    title, 
    description, 
    teacher_id, 
    subject_id, 
    grades, 
    due_date, 
    type, 
    max_grade,
    allowed_formats,
    max_files,
    max_size_mb,
    created_at
) VALUES 
(
    'Tarea de Matemáticas - Álgebra Básica',
    'Resolver los ejercicios del capítulo 3 sobre ecuaciones lineales. Subir foto de la solución.',
    3,
    24,
    '["3° A"]',
    '2024-11-15',
    'MULTIMEDIA',
    5.0,
    '["jpg", "png", "pdf"]',
    3,
    5,
    NOW()
),
(
    'Quiz de Ciencias Naturales',
    'Evaluación interactiva sobre el sistema solar y los planetas.',
    3,
    19,
    '["2° C"]',
    '2024-11-20',
    'INTERACTIVE',
    5.0,
    NULL,
    NULL,
    NULL,
    NOW()
);

SELECT 'Task templates table updated successfully!' as status;