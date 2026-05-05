-- ============================================================
--  PetCare Manager — V3: Mascotas
--  Depende de: V2 (Clientes)
-- ============================================================

CREATE TABLE Mascotas (
    MascotaID      INT            NOT NULL AUTO_INCREMENT,
    Nombre         VARCHAR(100)   NOT NULL,
    Especie        VARCHAR(60)    NOT NULL,
    Raza           VARCHAR(100)   NULL,
    Edad           INT            NULL,               -- en años
    Peso_kg        DECIMAL(5, 2)  NULL,               -- RF-04.1: campo requerido
    Observaciones  TEXT           NULL,               -- alergias, comportamiento, etc.
    Fecha_creacion DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    cliente_id     INT            NOT NULL,

    CONSTRAINT pk_mascotas     PRIMARY KEY (MascotaID),
    CONSTRAINT fk_masc_cliente FOREIGN KEY (cliente_id)
        REFERENCES Clientes (ClienteID)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
);
