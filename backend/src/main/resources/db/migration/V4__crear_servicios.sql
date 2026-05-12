-- ============================================================
--  PetCare Manager — V4: Servicios
--  Motor: PostgreSQL
--  No depende de ninguna tabla anterior
-- ============================================================

-- ------------------------------------------------------------
--  SERVICIOS
--
--  Activo → BOOLEAN. TRUE = disponible para asignar,
--           FALSE = desactivado (no aparece en el formulario)
--
--  Fecha_creacion → automática, no se pide al usuario
-- ------------------------------------------------------------
CREATE TABLE Servicios (
    ServicioID     SERIAL         NOT NULL,
    Nombre         VARCHAR(120)   NOT NULL,
    Descripcion    TEXT,
    Precio         NUMERIC(10, 2) NOT NULL,
    Activo         BOOLEAN        NOT NULL DEFAULT TRUE,
    Fecha_creacion TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT pk_servicios     PRIMARY KEY (ServicioID),
    CONSTRAINT chk_precio_pos   CHECK (Precio >= 0)
);
