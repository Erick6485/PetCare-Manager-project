-- ============================================================
--  PetCare Manager — V4: Servicios
--  Depende de: ninguna tabla anterior
-- ============================================================
CREATE TABLE Servicios (
    ServicioID     INT            NOT NULL AUTO_INCREMENT,
    Nombre         VARCHAR(100)   NOT NULL,
    Descripcion    TEXT           NULL,
    Precio         NUMERIC(10, 2) NOT NULL,
    Activo         BOOLEAN        NOT NULL DEFAULT true,
    Fecha_creacion TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT pk_servicios PRIMARY KEY (ServicioID),
    CONSTRAINT chk_precio_pos CHECK (Precio > 0)    
);
