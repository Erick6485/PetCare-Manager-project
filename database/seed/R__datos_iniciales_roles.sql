-- ============================================================
--  PetCare Manager — SEED: Datos iniciales
--  Prefijo R__ = script repetible (Flyway lo re-ejecuta si cambia)
-- ============================================================
 
-- Roles del sistema
INSERT INTO Roles (Nombre) VALUES
    ('ADMINISTRADOR'),
    ('RECEPCIONISTA'),
    ('PELUQUERO')
ON CONFLICT (Nombre) DO NOTHING;
 
-- Usuario administrador inicial
-- Contrasena = bcrypt('Admin2025*')
-- IMPORTANTE: cambiar en el primer inicio de sesión
INSERT INTO Usuarios (
    Nombre_completo,
    Correo,
    Nombre_usuario,
    Contrasena,
    Estado_actividad,
    rol_id
)
SELECT
    'Administrador PetCare',
    'admin@petcare.com',
    'admin',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
    true,
    RolID
FROM Roles
WHERE Nombre = 'ADMINISTRADOR'
ON CONFLICT (Nombre_usuario) DO NOTHING;