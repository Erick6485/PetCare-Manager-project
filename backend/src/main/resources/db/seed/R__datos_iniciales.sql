-- ============================================================
--  PetCare Manager — SEED: Datos iniciales
--  Motor: PostgreSQL
--  Ejecutar después de todos los V__ de migración
-- ============================================================

-- ------------------------------------------------------------
--  ROLES DEL SISTEMA
--  ON CONFLICT DO NOTHING → si ya existen no falla ni duplica
-- ------------------------------------------------------------
INSERT INTO Roles (Nombre) VALUES
    ('ADMINISTRADOR'),
    ('RECEPCIONISTA'),
    ('PELUQUERO')
ON CONFLICT (Nombre) DO NOTHING;

-- ------------------------------------------------------------
--  USUARIO ADMINISTRADOR INICIAL
--
--  Contrasena = hash bcrypt de 'Admin2025*'
--  strength 10 (estándar seguro)
--
--  IMPORTANTE: cambiar la contraseña en el primer
--  inicio de sesión desde la interfaz del sistema.
--
--  ON CONFLICT DO NOTHING → si ya existe no falla
-- ------------------------------------------------------------
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
    '$2a$10$nCYSRUxDioF///.Ox0bHrurN3QwSSODRiAwlYnil6OYJLi/BBfoh6',
    TRUE,
    RolID
FROM Roles
WHERE Nombre = 'ADMINISTRADOR'
ON CONFLICT (Nombre_usuario) DO NOTHING;
