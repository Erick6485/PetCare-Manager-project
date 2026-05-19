package com.petcare.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Entidad que representa la tabla Bitacora_Estados.
 * Registra cada cambio de estado de una atención con quién y cuándo.
 * Esta tabla es inmutable — ningún rol puede editar sus registros.
 */
@Entity
@Table(name = "bitacora_estados")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BitacoraEstado {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "estadosid")
    private Integer estadosId;

    @Column(name = "estado_anterior", nullable = false)
    private String estadoAnterior;

    @Column(name = "estado_nuevo", nullable = false)
    private String estadoNuevo;

    @Column(name = "fecha_hora", nullable = false, updatable = false)
    private LocalDateTime fechaHora;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "atencion_id", nullable = false)
    private Atencion atencion;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @PrePersist
    protected void onCreate() {
        this.fechaHora = LocalDateTime.now();
    }
}