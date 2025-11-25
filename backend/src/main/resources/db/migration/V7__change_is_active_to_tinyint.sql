-- Migración para cambiar is_active de bit(1) a TINYINT(1)
-- Esto soluciona el error 1406 cuando JPA/Hibernate actualiza usuarios

-- Cambiar el tipo de dato de is_active
ALTER TABLE users MODIFY COLUMN is_active TINYINT(1) DEFAULT 1;

-- Actualizar valores NULL a 1 (activo por defecto)
UPDATE users SET is_active = 1 WHERE is_active IS NULL;
