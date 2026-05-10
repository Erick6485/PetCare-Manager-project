-- ============================================================
--  PetCare Manager — V3: Mascotas
--  Depende de: V2 (Clientes)
-- ============================================================
CREATE TABLE Mascotas (
    MascotaID      SERIAL            NOT NULL,
    Nombre         VARCHAR(50)       NOT NULL,
    Especie        VARCHAR(30)       NOT NULL,
    Raza           VARCHAR(20)       NULL,
    Edad           INT               NULL,
    Peso_kg        NUMERIC(5, 2)     NULL,
    Observaciones  TEXT              NULL,
    Fecha_creacion TIMESTAMP         NOT NULL DEFAULT CURRENT_TIMESTAMP,
    cliente_id     INT               NOT NULL,

    CONSTRAINT pk_mascotas     PRIMARY KEY (MascotaID),
    CONSTRAINT fk_masc_cliente FOREIGN KEY (cliente_id)
        REFERENCES Clientes (ClienteID)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
);
