-- ============================================================
--  PetCare Manager — V6: Evidencias y Bitacora_Estados
--  Depende de: V5 (Atenciones), V1 (Usuarios)
-- ============================================================
 
-- ------------------------------------------------------------
--  EVIDENCIAS
--  Almacena imágenes antes/después de cada atención.
--  RNF: tamaño máximo 5 MB — validado en EvidenciaService
--  El formato (JPEG/PNG) se valida en la capa de servicio
-- ------------------------------------------------------------

CREATE TYPE tipo_evidencia AS ENUM (
    'ANTES',
    'DESPUES'
);

CREATE TABLE Evidencias (
    EvidenciaID   SERIAL          NOT NULL,
    Tipo          tipo_evidencia  NOT NULL,
    Ruta_archivo  VARCHAR(500)    NOT NULL,
    Tamanio_bytes INT             NOT NULL,
    Fecha_subida  TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    atencion_id   INT          NOT NULL,
 
    CONSTRAINT pk_evidencias    PRIMARY KEY (EvidenciaID),
    CONSTRAINT fk_evid_atencion FOREIGN KEY (atencion_id)
        REFERENCES Atenciones (AtencionID)
        ON UPDATE CASCADE ON DELETE CASCADE,
 
    -- RNF: máximo 5 MB = 5 242 880 bytes
    CONSTRAINT chk_tamanio CHECK (
        Tamanio_bytes > 0 AND Tamanio_bytes <= 5242880
    )
);
 
-- ------------------------------------------------------------
--  BITACORA_ESTADOS
--  Registra cada transición de estado de una atención:
--  quién la hizo, cuándo y desde/hasta qué estado.
-- ------------------------------------------------------------



CREATE TABLE Bitacora_Estados (
    EstadosID       SERIAL      NOT NULL,
    Estado_anterior estado_atencion NOT NULL,
    Estado_nuevo    estado_atencion NOT NULL,
    Fecha_hora      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    atencion_id     INT      NOT NULL,
    usuario_id      INT      NOT NULL,
 
    CONSTRAINT pk_bitacora_est   PRIMARY KEY (EstadosID),
    CONSTRAINT fk_biest_atencion FOREIGN KEY (atencion_id)
        REFERENCES Atenciones (AtencionID)
        ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT fk_biest_usuario  FOREIGN KEY (usuario_id)
        REFERENCES Usuarios (UsuarioID)
        ON UPDATE CASCADE ON DELETE RESTRICT
);  