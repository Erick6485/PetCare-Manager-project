-- ============================================================
--  PetCare Manager — V5: Atenciones
--  Depende de: V3 (Mascotas), V4 (Servicios), V1 (Usuarios)
-- ============================================================

CREATE TABLE Atenciones (
    AtencionID          INT           NOT NULL AUTO_INCREMENT,
    Estado              ENUM(
                            'PENDIENTE',
                            'EN_PROCESO',
                            'FINALIZADO',
                            'CANCELADO'
                        )             NOT NULL DEFAULT 'PENDIENTE',
    Fecha               DATE          NOT NULL,
    Hora                TIME          NOT NULL,
    Observaciones       TEXT          NULL,
    Fecha_creacion      DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    Fecha_actualizacion DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP
                                      ON UPDATE CURRENT_TIMESTAMP,
    mascota_id          INT           NOT NULL,
    servicio_id         INT           NOT NULL,
    peluquero_id        INT           NOT NULL,
    recepcionista_id    INT           NOT NULL,

    CONSTRAINT pk_atenciones        PRIMARY KEY (AtencionID),

    CONSTRAINT fk_aten_mascota      FOREIGN KEY (mascota_id)
        REFERENCES Mascotas (MascotaID)
        ON UPDATE CASCADE ON DELETE RESTRICT,

    CONSTRAINT fk_aten_servicio     FOREIGN KEY (servicio_id)
        REFERENCES Servicios (ServicioID)
        ON UPDATE CASCADE ON DELETE RESTRICT,

    CONSTRAINT fk_aten_peluquero    FOREIGN KEY (peluquero_id)
        REFERENCES Usuarios (UsuarioID)
        ON UPDATE CASCADE ON DELETE RESTRICT,

    CONSTRAINT fk_aten_recepcion    FOREIGN KEY (recepcionista_id)
        REFERENCES Usuarios (UsuarioID)
        ON UPDATE CASCADE ON DELETE RESTRICT
);

-- Índice para la validación de carga laboral (AppConstants.MAX_SERVICIOS_SIMULTANEOS)
-- AtencionService consulta por peluquero + fecha + hora antes de insertar
CREATE INDEX idx_aten_carga_laboral
    ON Atenciones (peluquero_id, Fecha, Hora, Estado);