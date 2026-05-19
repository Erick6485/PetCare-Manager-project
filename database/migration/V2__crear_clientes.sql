-- ============================================================
--  PetCare Manager — V2: Clientes
-- ============================================================

CREATE TABLE Clientes (
    ClienteID           SERIAL        NOT NULL,
    Nombre              VARCHAR(100)  NOT NULL,
    Documento_identidad VARCHAR(10)   NOT NULL,
    Telefono            VARCHAR(10)   NULL,
    Correo              VARCHAR(50)   NULL,
    Fecha_creacion      TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT pk_clientes      PRIMARY KEY (ClienteID),
    CONSTRAINT uq_clientes_doc  UNIQUE      (Documento_identidad)
);
