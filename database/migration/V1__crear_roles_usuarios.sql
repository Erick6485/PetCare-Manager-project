---------------------------------------------------------------
--  PetCare Manager — V1: Roles y Usuarios
--  Flyway ejecuta este archivo primero por su prefijo V1__
---------------------------------------------------------------
 
---------------------------------------------------------------
-- ROLES
---------------------------------------------------------------
CREATE TABLE Roles (
    RolID   SERIAL       NOT NULL AUTO_INCREMENT,
    Nombre  VARCHAR(50)  NOT NULL,
 
    CONSTRAINT pk_roles     PRIMARY KEY (RolID),
    CONSTRAINT uq_roles_nom UNIQUE      (Nombre)
);
 
---------------------------------------------------------------
-- USUARIOS
-- Fecha_creacion: asignada automáticamente por la BD (DEFAULT)
---------------------------------------------------------------
CREATE TABLE Usuarios (
    UsuarioID        SERIAL       NOT NULL,
    Nombre_completo  VARCHAR(150) NOT NULL,
    Telefono         VARCHAR(10)  NULL,
    Correo           VARCHAR(50)  NOT NULL,
    Nombre_usuario   VARCHAR(50)  NOT NULL,
    Contrasena       VARCHAR(255) NOT NULL,
    Estado_actividad BOOLEAN      NOT NULL DEFAULT true,
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