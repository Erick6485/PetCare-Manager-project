-- ============================================================
--  PetCare Manager — V5: Atenciones
--  Motor: PostgreSQL
--  Depende de: V1 (Usuarios), V3 (Mascotas), V4 (Servicios)
-- ============================================================

-- ------------------------------------------------------------
--  TIPO ENUM para estado de atención
--
--  En PostgreSQL los ENUM se crean como tipos reutilizables.
--  Esto es mejor que VARCHAR + CHECK porque PostgreSQL
--  valida el valor automáticamente y lo muestra con nombre
--  claro en las consultas.
-- ------------------------------------------------------------
CREATE TYPE estado_atencion AS ENUM (
    'PENDIENTE',
    'EN_PROCESO',
    'FINALIZADO',
    'CANCELADO'
);

-- ------------------------------------------------------------
--  ATENCIONES
--
--  Estado         → usa el tipo ENUM creado arriba.
--                   Valor inicial siempre PENDIENTE.
--
--  peluquero_id   → elegido por la recepcionista en el
--                   formulario al crear la atención.
--
--  recepcionista_id → asignado automáticamente por el
--                     backend desde la sesión activa.
--                     No aparece en el formulario.
--
--  Fecha_creacion → automática, la BD la asigna sola.
-- ------------------------------------------------------------
CREATE TABLE Atenciones (
    AtencionID       SERIAL           NOT NULL,
    Estado           estado_atencion  NOT NULL DEFAULT 'PENDIENTE',
    Fecha            DATE             NOT NULL,
    Hora             TIME             NOT NULL,
    Observaciones    TEXT,
    Fecha_creacion   TIMESTAMP        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    mascota_id       INT              NOT NULL,
    servicio_id      INT              NOT NULL,
    peluquero_id     INT              NOT NULL,
    recepcionista_id INT              NOT NULL,

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

-- ------------------------------------------------------------
--  ÍNDICE DE CARGA LABORAL
--
--  AtencionService usa este índice para consultar rápidamente
--  cuántas atenciones tiene un peluquero en una fecha y hora
--  específica antes de permitir una nueva asignación.
--  (AppConstants.MAX_SERVICIOS_SIMULTANEOS = 3)
-- ------------------------------------------------------------
CREATE INDEX idx_aten_carga_laboral
    ON Atenciones (peluquero_id, Fecha, Hora, Estado);
