-- ============================================================
--  PetCare Manager — V6: Evidencias y Bitacora_Estados
--  Motor: PostgreSQL
--  Depende de: V1 (Usuarios), V5 (Atenciones)
-- ============================================================

-- ------------------------------------------------------------
--  TIPO ENUM para tipo de evidencia
-- ------------------------------------------------------------
CREATE TYPE tipo_evidencia AS ENUM (
    'ANTES',
    'DESPUES'
);

-- ------------------------------------------------------------
--  EVIDENCIAS
--
--  Almacena las imágenes antes/después de cada atención.
--
--  Tipo          → ENUM: solo permite 'ANTES' o 'DESPUES'
--
--  Ruta_archivo  → ruta en el servidor donde se guardó
--                  la imagen (ej: /uploads/atencion_5_antes.jpg)
--
--  Tamanio_bytes → CHECK garantiza que no supere 5 MB.
--                  La validación del formato (JPEG/PNG)
--                  la hace EvidenciaService en el backend.
--
--  Fecha_subida  → automática, la BD la asigna sola.
--
--  ON DELETE CASCADE → si se borra una atención,
--                      sus evidencias se borran también.
-- ------------------------------------------------------------
CREATE TABLE Evidencias (
    EvidenciaID   SERIAL       NOT NULL,
    Tipo          tipo_evidencia NOT NULL,
    Ruta_archivo  VARCHAR(500) NOT NULL,
    Tamanio_bytes INT          NOT NULL,
    Fecha_subida  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
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
--
--  Registra cada cambio de estado de una atención.
--  Quién lo hizo, cuándo y desde/hasta qué estado.
--
--  Esta tabla es INMUTABLE — ningún rol puede editar
--  ni borrar sus registros (RNF de auditoría).
--
--  Fecha_hora    → automática con DEFAULT CURRENT_TIMESTAMP.
--                  El sistema la asigna, no el usuario.
--
--  ON DELETE CASCADE en atencion_id → si se cancela y
--  elimina una atención, su bitácora se borra también.
--
--  ON DELETE RESTRICT en usuario_id → no se puede borrar
--  un usuario que tenga registros en la bitácora.
-- ------------------------------------------------------------
CREATE TABLE Bitacora_Estados (
    EstadosID       SERIAL          NOT NULL,
    Estado_anterior estado_atencion NOT NULL,
    Estado_nuevo    estado_atencion NOT NULL,
    Fecha_hora      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    atencion_id     INT             NOT NULL,
    usuario_id      INT             NOT NULL,

    CONSTRAINT pk_bitacora_est   PRIMARY KEY (EstadosID),
    CONSTRAINT fk_biest_atencion FOREIGN KEY (atencion_id)
        REFERENCES Atenciones (AtencionID)
        ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT fk_biest_usuario  FOREIGN KEY (usuario_id)
        REFERENCES Usuarios (UsuarioID)
        ON UPDATE CASCADE ON DELETE RESTRICT
);
