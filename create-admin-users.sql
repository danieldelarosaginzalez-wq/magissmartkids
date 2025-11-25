-- Script para crear 5 usuarios administradores
-- Contraseña por defecto: Admin123! (encriptada con BCrypt)
-- Hash BCrypt válido para "Admin123!": $2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy

-- Primero, eliminar usuarios admin existentes si existen (opcional, comentar si no quieres eliminar)
DELETE FROM users WHERE username IN ('admin1', 'admin2', 'admin3', 'admin4', 'admin5');

-- Usuario Admin 1
INSERT INTO users (username, email, password, first_name, last_name, role, is_active, created_at, updated_at)
VALUES (
    'admin1',
    'admin1@magicsmartkids.com',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', -- Admin123!
    'Administrador',
    'Principal',
    'SUPER_ADMIN',
    true,
    NOW(),
    NOW()
);

-- Usuario Admin 2
INSERT INTO users (username, email, password, first_name, last_name, role, is_active, created_at, updated_at)
VALUES (
    'admin2',
    'admin2@magicsmartkids.com',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', -- Admin123!
    'Administrador',
    'Secundario',
    'SUPER_ADMIN',
    true,
    NOW(),
    NOW()
);

-- Usuario Admin 3
INSERT INTO users (username, email, password, first_name, last_name, role, is_active, created_at, updated_at)
VALUES (
    'admin3',
    'admin3@magicsmartkids.com',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', -- Admin123!
    'Administrador',
    'Sistemas',
    'SUPER_ADMIN',
    true,
    NOW(),
    NOW()
);

-- Usuario Admin 4
INSERT INTO users (username, email, password, first_name, last_name, role, is_active, created_at, updated_at)
VALUES (
    'admin4',
    'admin4@magicsmartkids.com',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', -- Admin123!
    'Administrador',
    'Soporte',
    'SUPER_ADMIN',
    true,
    NOW(),
    NOW()
);

-- Usuario Admin 5
INSERT INTO users (username, email, password, first_name, last_name, role, is_active, created_at, updated_at)
VALUES (
    'admin5',
    'admin5@magicsmartkids.com',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', -- Admin123!
    'Administrador',
    'General',
    'SUPER_ADMIN',
    true,
    NOW(),
    NOW()
);

-- Verificar que se crearon correctamente
SELECT id, username, email, first_name, last_name, role, is_active 
FROM users 
WHERE username IN ('admin1', 'admin2', 'admin3', 'admin4', 'admin5')
ORDER BY username;
