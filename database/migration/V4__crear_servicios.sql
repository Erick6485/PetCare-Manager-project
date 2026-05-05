-- ============================================================
--  PetCare Manager — V4: Servicios
--  Depende de: ninguna tabla anterior
-- ============================================================
CREATE TABLE Servicios (
                           ServicioID   INT            NOT NULL AUTO_INCREMENT,
                           Nombre       VARCHAR(120)   NOT NULL,
                           Descripcion  TEXT           NULL,
                           Precio       DECIMAL(10, 2) NOT NULL,
                           Activo       TINYINT(1)     NOT NULL DEFAULT 1,   -- 1 = disponible, 0 = inactivo

                           CONSTRAINT pk_servicios PRIMARY KEY (ServicioID)
);
