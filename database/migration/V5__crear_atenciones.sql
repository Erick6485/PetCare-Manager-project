-- ============================================================
--  PetCare Manager — V5: Atenciones
--  Depende de: V3 (Mascotas), V4 (Servicios), V1 (Usuarios)
-- ============================================================

CREATE TYPE estado_atencion AS ENUM (
    'PENDIENTE',
    'EN_PROCESO',
    'FINALIZADO',
    'CANCELADO'
);

CREATE TABLE Atenciones (
    AtencionID          SERIAL            NOT NULL,
    Estado              estado_atencion   NOT NULL DEFAULT 'PENDIENTE',
    Fecha               DATE              NOT NULL,
    Hora                TIME              NOT NULL,
    Observaciones       TEXT              NULL,
    Fecha_creacion      TIMESTAMP         NOT NULL DEFAULT CURRENT_TIMESTAMP,
    mascota_id          INT               NOT NULL,
    servicio_id         INT               NOT NULL,
    peluquero_id        INT               NOT NULL,
    recepcionista_id    INT               NOT NULL,
 
    CONSTRAINT pk_atenciones     PRIMARY KEY (AtencionID),
 
    CONSTRAINT fk_aten_mascota   FOREIGN KEY (mascota_id)
        REFERENCES Mascotas (MascotaID)
        ON UPDATE CASCADE ON DELETE RESTRICT,
 
    CONSTRAINT fk_aten_servicio  FOREIGN KEY (servicio_id)
        REFERENCES Servicios (ServicioID)
        ON UPDATE CASCADE ON DELETE RESTRICT,
 
    CONSTRAINT fk_aten_peluquero FOREIGN KEY (peluquero_id)
        REFERENCES Usuarios (UsuarioID)
        ON UPDATE CASCADE ON DELETE RESTRICT,
 
    CONSTRAINT fk_aten_recepcion FOREIGN KEY (recepcionista_id)
        REFERENCES Usuarios (UsuarioID)
        ON UPDATE CASCADE ON DELETE RESTRICT
);

-- Índice para validar carga laboral del peluquero (AppConstants.MAX_SERVICIOS_SIMULTANEOS = 3)
-- AtencionService consulta: ¿cuántas atenciones tiene este peluquero en esta fecha y hora?
CREATE INDEX idx_aten_carga_laboral
    ON Atenciones (peluquero_id, Fecha, Hora, Estado);