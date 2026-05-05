-- ============================================================
--  PetCare Manager — V2: Clientes
--  Depende de: ninguna tabla anterior
-- ============================================================

CREATE TABLE Clientes (
    ClienteID           INT           NOT NULL AUTO_INCREMENT,
    Nombre              VARCHAR(150)  NOT NULL,
    Documento_identidad VARCHAR(30)   NOT NULL,       -- RF-03.5: evita duplicados
    Telefono            VARCHAR(20)   NULL,
    Correo              VARCHAR(150)  NULL,
    Fecha_creacion      DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT pk_clientes      PRIMARY KEY (ClienteID),
    CONSTRAINT uq_clientes_doc  UNIQUE      (Documento_identidad)
);
