-- Verificar si la columna is_active existe antes de agregarla
-- Si da error, significa que ya existe y puedes ignorar el error

-- Agregar columna is_active a teacher_subjects
ALTER TABLE teacher_subjects 
ADD COLUMN is_active BOOLEAN DEFAULT TRUE;

-- Actualizar registros existentes para que estén activos (usando id para evitar safe mode)
UPDATE teacher_subjects SET is_active = TRUE WHERE id > 0 AND is_active IS NULL;

-- Alternativa si no hay registros existentes:
-- UPDATE teacher_subjects SET is_active = TRUE WHERE id IS NOT NULL;