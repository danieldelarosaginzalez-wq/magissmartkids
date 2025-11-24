-- Agregar campo city a la tabla institutions
ALTER TABLE institutions ADD COLUMN city VARCHAR(100);

-- Actualizar instituciones existentes extrayendo la ciudad de la dirección
UPDATE institutions 
SET city = CASE
    WHEN address LIKE '%Bogotá%' OR address LIKE '%bogota%' THEN 'Bogotá'
    WHEN address LIKE '%Medellín%' OR address LIKE '%medellin%' THEN 'Medellín'
    WHEN address LIKE '%Cali%' THEN 'Cali'
    WHEN address LIKE '%Barranquilla%' THEN 'Barranquilla'
    WHEN address LIKE '%Cartagena%' THEN 'Cartagena'
    WHEN address LIKE '%Bucaramanga%' THEN 'Bucaramanga'
    WHEN address LIKE '%Pereira%' THEN 'Pereira'
    WHEN address LIKE '%Manizales%' THEN 'Manizales'
    ELSE 'Otras'
END
WHERE address IS NOT NULL;

-- Establecer 'Otras' para instituciones sin dirección
UPDATE institutions 
SET city = 'Otras'
WHERE city IS NULL;
