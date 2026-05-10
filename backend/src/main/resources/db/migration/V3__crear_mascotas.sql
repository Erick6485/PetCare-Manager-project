-- ============================================================
--  PetCare Manager — V3: Mascotas
--  Motor: PostgreSQL
--  Depende de: V2 (Clientes)
-- ============================================================

-- ------------------------------------------------------------
--  MASCOTAS
--
--  cliente_id → FK hacia Clientes. ON DELETE RESTRICT evita
--  borrar un cliente que tenga mascotas registradas
--
--  Peso_kg    → NUMERIC(5,2): hasta 999.99 kg
--
--  Observaciones → TEXT libre para alergias, comportamiento,
--                  condiciones médicas especiales
-- ------------------------------------------------------------
CREATE TABLE Mascotas (
    MascotaID      SERIAL        NOT NULL,
    Nombre         VARCHAR(100)  NOT NULL,
    Especie        VARCHAR(60)   NOT NULL,
    Raza           VARCHAR(100),
    Edad           INT,
    Peso_kg        NUMERIC(5, 2),
    Observaciones  TEXT,
    Fecha_creacion TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    cliente_id     INT           NOT NULL,

    CONSTRAINT pk_mascotas     PRIMARY KEY (MascotaID),
    CONSTRAINT fk_masc_cliente FOREIGN KEY (cliente_id)
        REFERENCES Clientes (ClienteID)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
);
