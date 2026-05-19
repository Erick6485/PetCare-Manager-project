-- ============================================================
--  PetCare Manager — V1: Roles y Usuarios
--  Motor: PostgreSQL
--  Ejecutar primero — no depende de ninguna otra tabla
-- ============================================================

-- ------------------------------------------------------------
--  ROLES
--  Tabla simple: solo id y nombre del rol
-- ------------------------------------------------------------
CREATE TABLE Roles (
    RolID  SERIAL       NOT NULL,
    Nombre VARCHAR(50)  NOT NULL,

    CONSTRAINT pk_roles     PRIMARY KEY (RolID),
    CONSTRAINT uq_roles_nom UNIQUE      (Nombre)
);

-- ------------------------------------------------------------
--  USUARIOS
--
--  SERIAL        → equivale a AUTO_INCREMENT de MySQL,
--                  PostgreSQL genera el ID solo
--
--  BOOLEAN       → equivale a TINYINT(1) de MySQL
--                  TRUE = activo, FALSE = inactivo
--
--  Fecha_creacion → DEFAULT CURRENT_TIMESTAMP la asigna
--                   la BD automáticamente al insertar.
--                   No se pide al usuario ni se elige.
--
--  Contrasena    → se guarda el hash bcrypt, nunca la
--                  contraseña en texto plano
-- ------------------------------------------------------------
CREATE TABLE Usuarios (
    UsuarioID        SERIAL       NOT NULL,
    Nombre_completo  VARCHAR(150) NOT NULL,
    Telefono         VARCHAR(20),
    Correo           VARCHAR(150) NOT NULL,
    Nombre_usuario   VARCHAR(80)  NOT NULL,
    Contrasena       VARCHAR(255) NOT NULL,
    Estado_actividad BOOLEAN      NOT NULL DEFAULT TRUE,
    Fecha_creacion   TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    rol_id           INT          NOT NULL,

    CONSTRAINT pk_usuarios     PRIMARY KEY (UsuarioID),
    CONSTRAINT uq_usuarios_usr UNIQUE      (Nombre_usuario),
    CONSTRAINT uq_usuarios_cor UNIQUE      (Correo),
    CONSTRAINT fk_usuarios_rol FOREIGN KEY (rol_id)
        REFERENCES Roles (RolID)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
);
