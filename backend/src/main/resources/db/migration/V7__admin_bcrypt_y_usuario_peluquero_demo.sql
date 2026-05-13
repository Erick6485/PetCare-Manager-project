-- Asegura hash bcrypt válido para Admin2025* y usuario demo peluquero (misma contraseña).
-- Hash generado con BCryptPasswordEncoder (strength 10).

UPDATE Usuarios
SET Contrasena = '$2a$10$nCYSRUxDioF///.Ox0bHrurN3QwSSODRiAwlYnil6OYJLi/BBfoh6'
WHERE Nombre_usuario = 'admin';

INSERT INTO Usuarios (
    Nombre_completo,
    Correo,
    Nombre_usuario,
    Contrasena,
    Estado_actividad,
    rol_id
)
SELECT
    'Peluquero Demo',
    'peluquero@petcare.com',
    'peluquero',
    '$2a$10$nCYSRUxDioF///.Ox0bHrurN3QwSSODRiAwlYnil6OYJLi/BBfoh6',
    TRUE,
    RolID
FROM Roles
WHERE Nombre = 'PELUQUERO'
ON CONFLICT (Nombre_usuario) DO NOTHING;
