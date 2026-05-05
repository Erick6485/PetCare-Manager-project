-- ============================================================
--  PetCare Manager — SEED: Datos iniciales
--  Prefijo R__ = script repetible (Flyway lo re-ejecuta si cambia)
--  Inserta los roles base y el usuario administrador inicial
-- ============================================================

-- Roles del sistema
INSERT INTO Roles (Nombre) VALUES
    ('ADMINISTRADOR'),
    ('RECEPCIONISTA'),
    ('PELUQUERO')
ON DUPLICATE KEY UPDATE Nombre = VALUES(Nombre);

-- Usuario administrador inicial
-- IMPORTANTE: cambiar la contraseña en el primer inicio de sesión
-- Contrasena = bcrypt('Admin2025*') generado con strength 10
INSERT INTO Usuarios (
    Nombre_completo,
    Telefono,
    Correo,
    Nombre_usuario,
    Contrasena,
    Estado_actividad,
    rol_id
) VALUES (
    'Administrador PetCare',
    NULL,
    'admin@petcare.com',
    'admin',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
    1,
    (SELECT RolID FROM Roles WHERE Nombre = 'ADMINISTRADOR')
)
ON DUPLICATE KEY UPDATE
    Nombre_completo = VALUES(Nombre_completo),
    rol_id          = VALUES(rol_id);