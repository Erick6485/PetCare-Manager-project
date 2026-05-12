-- ============================================================
--  PetCare Manager — V2: Clientes
--  Motor: PostgreSQL
--  No depende de ninguna tabla anterior
-- ============================================================

-- ------------------------------------------------------------
--  CLIENTES
--
--  Documento_identidad → UNIQUE garantiza que no se pueda
--  registrar el mismo cliente dos veces (RF-03.5)
--
--  Fecha_creacion → automática, la BD la asigna sola
-- ------------------------------------------------------------
CREATE TABLE Clientes (
    ClienteID           SERIAL       NOT NULL,
    Nombre              VARCHAR(150) NOT NULL,
    Documento_identidad VARCHAR(30)  NOT NULL,
    Telefono            VARCHAR(20),
    Correo              VARCHAR(150),
    Fecha_creacion      TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT pk_clientes     PRIMARY KEY (ClienteID),
    CONSTRAINT uq_clientes_doc UNIQUE      (Documento_identidad)
);
