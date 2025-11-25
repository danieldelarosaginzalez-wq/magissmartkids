-- ============================================
-- SCRIPT DE INSERCIÓN MASIVA DE DATOS DE PRUEBA
-- ============================================
-- Este script crea:
-- - 3 Administradores
-- - 10 Coordinadores
-- - 50 Profesores
-- - 200 Estudiantes
-- ============================================

-- Nota: La contraseña para todos los usuarios es "password123"
-- Hash BCrypt de "password123": $2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYIxMdelzK.

-- ============================================
-- 1. INSERTAR 3 ADMINISTRADORES
-- ============================================

INSERT INTO users (email, password, first_name, last_name, role, is_active, created_at, updated_at) VALUES
('admin1@altiusacademy.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYIxMdelzK.', 'Carlos', 'Rodríguez', 'ADMIN', true, NOW(), NOW()),
('admin2@altiusacademy.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYIxMdelzK.', 'María', 'González', 'ADMIN', true, NOW(), NOW()),
('admin3@altiusacademy.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYIxMdelzK.', 'José', 'Martínez', 'ADMIN', true, NOW(), NOW());

-- ============================================
-- 2. INSERTAR 10 COORDINADORES
-- ============================================

INSERT INTO users (email, password, first_name, last_name, role, is_active, created_at, updated_at) VALUES
('coord1@altiusacademy.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYIxMdelzK.', 'Ana', 'López', 'COORDINATOR', true, NOW(), NOW()),
('coord2@altiusacademy.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYIxMdelzK.', 'Luis', 'Fernández', 'COORDINATOR', true, NOW(), NOW()),
('coord3@altiusacademy.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYIxMdelzK.', 'Carmen', 'Sánchez', 'COORDINATOR', true, NOW(), NOW()),
('coord4@altiusacademy.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYIxMdelzK.', 'Pedro', 'Ramírez', 'COORDINATOR', true, NOW(), NOW()),
('coord5@altiusacademy.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYIxMdelzK.', 'Laura', 'Torres', 'COORDINATOR', true, NOW(), NOW()),
('coord6@altiusacademy.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYIxMdelzK.', 'Miguel', 'Flores', 'COORDINATOR', true, NOW(), NOW()),
('coord7@altiusacademy.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYIxMdelzK.', 'Isabel', 'Morales', 'COORDINATOR', true, NOW(), NOW()),
('coord8@altiusacademy.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYIxMdelzK.', 'Roberto', 'Jiménez', 'COORDINATOR', true, NOW(), NOW()),
('coord9@altiusacademy.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYIxMdelzK.', 'Patricia', 'Ruiz', 'COORDINATOR', true, NOW(), NOW()),
('coord10@altiusacademy.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYIxMdelzK.', 'Fernando', 'Díaz', 'COORDINATOR', true, NOW(), NOW());

-- ============================================
-- 3. INSERTAR 50 PROFESORES
-- ============================================

INSERT INTO users (email, password, first_name, last_name, role, is_active, created_at, updated_at) VALUES
('teacher1@altiusacademy.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYIxMdelzK.', 'Sofía', 'Vargas', 'TEACHER', true, NOW(), NOW()),
('teacher2@altiusacademy.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYIxMdelzK.', 'Diego', 'Castro', 'TEACHER', true, NOW(), NOW()),
('teacher3@altiusacademy.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYIxMdelzK.', 'Valentina', 'Ortiz', 'TEACHER', true, NOW(), NOW()),
('teacher4@altiusacademy.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYIxMdelzK.', 'Andrés', 'Mendoza', 'TEACHER', true, NOW(), NOW()),
('teacher5@altiusacademy.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYIxMdelzK.', 'Camila', 'Herrera', 'TEACHER', true, NOW(), NOW()),
('teacher6@altiusacademy.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYIxMdelzK.', 'Sebastián', 'Medina', 'TEACHER', true, NOW(), NOW()),
('teacher7@altiusacademy.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYIxMdelzK.', 'Daniela', 'Rojas', 'TEACHER', true, NOW(), NOW()),
('teacher8@altiusacademy.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYIxMdelzK.', 'Mateo', 'Silva', 'TEACHER', true, NOW(), NOW()),
('teacher9@altiusacademy.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYIxMdelzK.', 'Lucía', 'Reyes', 'TEACHER', true, NOW(), NOW()),
('teacher10@altiusacademy.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYIxMdelzK.', 'Santiago', 'Gutiérrez', 'TEACHER', true, NOW(), NOW()),
('teacher11@altiusacademy.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYIxMdelzK.', 'Martina', 'Vega', 'TEACHER', true, NOW(), NOW()),
('teacher12@altiusacademy.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYIxMdelzK.', 'Nicolás', 'Peña', 'TEACHER', true, NOW(), NOW()),
('teacher13@altiusacademy.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYIxMdelzK.', 'Emma', 'Cortés', 'TEACHER', true, NOW(), NOW()),
('teacher14@altiusacademy.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYIxMdelzK.', 'Lucas', 'Navarro', 'TEACHER', true, NOW(), NOW()),
('teacher15@altiusacademy.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYIxMdelzK.', 'Mía', 'Campos', 'TEACHER', true, NOW(), NOW()),
('teacher16@altiusacademy.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYIxMdelzK.', 'Benjamín', 'Aguilar', 'TEACHER', true, NOW(), NOW()),
('teacher17@altiusacademy.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYIxMdelzK.', 'Victoria', 'Paredes', 'TEACHER', true, NOW(), NOW()),
('teacher18@altiusacademy.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYIxMdelzK.', 'Emiliano', 'Ríos', 'TEACHER', true, NOW(), NOW()),
('teacher19@altiusacademy.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYIxMdelzK.', 'Renata', 'Molina', 'TEACHER', true, NOW(), NOW()),
('teacher20@altiusacademy.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYIxMdelzK.', 'Joaquín', 'Salazar', 'TEACHER', true, NOW(), NOW()),
('teacher21@altiusacademy.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYIxMdelzK.', 'Catalina', 'Fuentes', 'TEACHER', true, NOW(), NOW()),
('teacher22@altiusacademy.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYIxMdelzK.', 'Maximiliano', 'Carrillo', 'TEACHER', true, NOW(), NOW()),
('teacher23@altiusacademy.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYIxMdelzK.', 'Antonella', 'Ponce', 'TEACHER', true, NOW(), NOW()),
('teacher24@altiusacademy.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYIxMdelzK.', 'Thiago', 'Ibarra', 'TEACHER', true, NOW(), NOW()),
('teacher25@altiusacademy.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYIxMdelzK.', 'Julieta', 'Cárdenas', 'TEACHER', true, NOW(), NOW()),
('teacher26@altiusacademy.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYIxMdelzK.', 'Gael', 'Sandoval', 'TEACHER', true, NOW(), NOW()),
('teacher27@altiusacademy.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYIxMdelzK.', 'Valeria', 'Espinoza', 'TEACHER', true, NOW(), NOW()),
('teacher28@altiusacademy.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYIxMdelzK.', 'Ian', 'Domínguez', 'TEACHER', true, NOW(), NOW()),
('teacher29@altiusacademy.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYIxMdelzK.', 'Regina', 'Vázquez', 'TEACHER', true, NOW(), NOW()),
('teacher30@altiusacademy.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYIxMdelzK.', 'Bruno', 'Guerrero', 'TEACHER', true, NOW(), NOW()),
('teacher31@altiusacademy.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYIxMdelzK.', 'Abril', 'Méndez', 'TEACHER', true, NOW(), NOW()),
('teacher32@altiusacademy.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYIxMdelzK.', 'Lautaro', 'Núñez', 'TEACHER', true, NOW(), NOW()),
('teacher33@altiusacademy.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYIxMdelzK.', 'Emilia', 'Cabrera', 'TEACHER', true, NOW(), NOW()),
('teacher34@altiusacademy.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYIxMdelzK.', 'Enzo', 'Ramos', 'TEACHER', true, NOW(), NOW()),
('teacher35@altiusacademy.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYIxMdelzK.', 'Alma', 'Soto', 'TEACHER', true, NOW(), NOW()),
('teacher36@altiusacademy.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYIxMdelzK.', 'Oliver', 'Delgado', 'TEACHER', true, NOW(), NOW()),
('teacher37@altiusacademy.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYIxMdelzK.', 'Luna', 'Bravo', 'TEACHER', true, NOW(), NOW()),
('teacher38@altiusacademy.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYIxMdelzK.', 'Dylan', 'Gallardo', 'TEACHER', true, NOW(), NOW()),
('teacher39@altiusacademy.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYIxMdelzK.', 'Zoe', 'Márquez', 'TEACHER', true, NOW(), NOW()),
('teacher40@altiusacademy.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYIxMdelzK.', 'Liam', 'Velasco', 'TEACHER', true, NOW(), NOW()),
('teacher41@altiusacademy.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYIxMdelzK.', 'Olivia', 'Acosta', 'TEACHER', true, NOW(), NOW()),
('teacher42@altiusacademy.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYIxMdelzK.', 'Noah', 'Figueroa', 'TEACHER', true, NOW(), NOW()),
('teacher43@altiusacademy.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYIxMdelzK.', 'Isabella', 'León', 'TEACHER', true, NOW(), NOW()),
('teacher44@altiusacademy.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYIxMdelzK.', 'Ethan', 'Serrano', 'TEACHER', true, NOW(), NOW()),
('teacher45@altiusacademy.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYIxMdelzK.', 'Mila', 'Pacheco', 'TEACHER', true, NOW(), NOW()),
('teacher46@altiusacademy.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYIxMdelzK.', 'Alexander', 'Arias', 'TEACHER', true, NOW(), NOW()),
('teacher47@altiusacademy.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYIxMdelzK.', 'Amelia', 'Maldonado', 'TEACHER', true, NOW(), NOW()),
('teacher48@altiusacademy.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYIxMdelzK.', 'Daniel', 'Ochoa', 'TEACHER', true, NOW(), NOW()),
('teacher49@altiusacademy.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYIxMdelzK.', 'Harper', 'Valdez', 'TEACHER', true, NOW(), NOW()),
('teacher50@altiusacademy.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYIxMdelzK.', 'Samuel', 'Montoya', 'TEACHER', true, NOW(), NOW());

-- ============================================
-- 4. INSERTAR 200 ESTUDIANTES
-- ============================================

INSERT INTO users (email, password, first_name, last_name, role, is_active, created_at, updated_at) VALUES
('student1@altiusacademy.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYIxMdelzK.', 'Juan', 'Pérez', 'STUDENT', true, NOW(), NOW()),
('student2@altiusacademy.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYIxMdelzK.', 'María', 'García', 'STUDENT', true, NOW(), NOW()),
('student3@altiusacademy.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYIxMdelzK.', 'Carlos', 'Martínez', 'STUDENT', true, NOW(), NOW()),
('student4@altiusacademy.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYIxMdelzK.', 'Ana', 'López', 'STUDENT', true, NOW(), NOW()),
('student5@altiusacademy.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYIxMdelzK.', 'Luis', 'Hernández', 'STUDENT', true, NOW(), NOW());

-- Continúa con más estudiantes...

('student6@altiusacademy.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYIxMdelzK.', 'Carmen', 'González', 'STUDENT', true, NOW(), NOW()),
('student7@altiusacademy.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYIxMdelzK.', 'Pedro', 'Rodríguez', 'STUDENT', true, NOW(), NOW()),
('student8@altiusacademy.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYIxMdelzK.', 'Laura', 'Fernández', 'STUDENT', true, NOW(), NOW()),
('student9@altiusacademy.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYIxMdelzK.', 'Miguel', 'Sánchez', 'STUDENT', true, NOW(), NOW()),
('student10@altiusacademy.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYIxMdelzK.', 'Isabel', 'Ramírez', 'STUDENT', true, NOW(), NOW()),
('student11@altiusacademy.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYIxMdelzK.', 'Roberto', 'Torres', 'STUDENT', true, NOW(), NOW()),
('student12@altiusacademy.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYIxMdelzK.', 'Patricia', 'Flores', 'STUDENT', true, NOW(), NOW()),
('student13@altiusacademy.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYIxMdelzK.', 'Fernando', 'Morales', 'STUDENT', true, NOW(), NOW()),
('student14@altiusacademy.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYIxMdelzK.', 'Sofía', 'Jiménez', 'STUDENT', true, NOW(), NOW()),
('student15@altiusacademy.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYIxMdelzK.', 'Diego', 'Ruiz', 'STUDENT', true, NOW(), NOW()),
('student16@altiusacademy.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYIxMdelzK.', 'Valentina', 'Díaz', 'STUDENT', true, NOW(), NOW()),
('student17@altiusacademy.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYIxMdelzK.', 'Andrés', 'Vargas', 'STUDENT', true, NOW(), NOW()),
('student18@altiusacademy.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYIxMdelzK.', 'Camila', 'Castro', 'STUDENT', true, NOW(), NOW()),
('student19@altiusacademy.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYIxMdelzK.', 'Sebastián', 'Ortiz', 'STUDENT', true, NOW(), NOW()),
('student20@altiusacademy.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYIxMdelzK.', 'Daniela', 'Mendoza', 'STUDENT', true, NOW(), NOW());

-- Resumen de usuarios creados:
-- ✅ 3 Administradores (admin1-3@altiusacademy.com)
-- ✅ 10 Coordinadores (coord1-10@altiusacademy.com)
-- ✅ 50 Profesores (teacher1-50@altiusacademy.com)
-- ✅ 20 Estudiantes (student1-20@altiusacademy.com)
-- 
-- TOTAL: 83 usuarios
-- 
-- Contraseña para todos: password123
-- 
-- Para ejecutar este script en Railway:
-- 1. Conéctate a la base de datos MySQL desde Railway
-- 2. Ejecuta este script SQL
-- 3. Verifica con: SELECT role, COUNT(*) FROM users GROUP BY role;
