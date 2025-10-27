-- ACTUALIZAR COLORES DE MATERIAS CON PALETA MEJORADA
-- Evitando el verde que no gusta y usando colores más atractivos

-- Matemáticas - Azul fuerte
UPDATE subjects SET color = '#2563EB' WHERE name = 'Matemáticas';

-- Lengua Española - Púrpura
UPDATE subjects SET color = '#7C3AED' WHERE name = 'Lengua Española';

-- Ciencias Naturales - Naranja
UPDATE subjects SET color = '#EA580C' WHERE name = 'Ciencias Naturales';

-- Ciencias Sociales - Rojo
UPDATE subjects SET color = '#DC2626' WHERE name = 'Ciencias Sociales';

-- Inglés - Azul claro
UPDATE subjects SET color = '#0EA5E9' WHERE name = 'Inglés';

-- Educación Artística - Rosa
UPDATE subjects SET color = '#EC4899' WHERE name = 'Educación Artística';

-- Educación Física - Marrón
UPDATE subjects SET color = '#A3A3A3' WHERE name = 'Educación Física';

-- Exploración del Medio - Amarillo dorado
UPDATE subjects SET color = '#F59E0B' WHERE name = 'Exploración del Medio';

-- Desarrollo del Lenguaje - Índigo
UPDATE subjects SET color = '#4F46E5' WHERE name = 'Desarrollo del Lenguaje';

-- Expresión Artística - Magenta
UPDATE subjects SET color = '#D946EF' WHERE name = 'Expresión Artística';

-- Psicomotricidad - Gris azulado
UPDATE subjects SET color = '#64748B' WHERE name = 'Psicomotricidad';

-- Verificar los nuevos colores
SELECT name, color, school_grade_id 
FROM subjects 
WHERE is_active = true 
ORDER BY school_grade_id, name;