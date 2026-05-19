package com.petcare.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

/**
 * Entidad que representa la tabla Atenciones.
 *
 * peluquero_id     → elegido por la recepcionista en el formulario
 * recepcionista_id → asignado automáticamente desde la sesión activa
 */
@Entity
@Table(name = "atenciones")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Atencion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "atencionid")
    private Integer atencionId;

    @Enumerated(EnumType.STRING)
    @Column(name = "estado", nullable = false)
    @Builder.Default
    private EstadoAtencion estado = EstadoAtencion.PENDIENTE;

    @Column(name = "fecha", nullable = false)
    private LocalDate fecha;

    @Column(name = "hora", nullable = false)
    private LocalTime hora;

    @Column(name = "observaciones", columnDefinition = "TEXT")
    private String observaciones;

    @Column(name = "fecha_creacion", nullable = false, updatable = false)
    private LocalDateTime fechaCreacion;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "mascota_id", nullable = false)
    private Mascota mascota;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "servicio_id", nullable = false)
    private Servicio servicio;

    // elegido por la recepcionista
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "peluquero_id", nullable = false)
    private Usuario peluquero;

    // asignado automáticamente desde la sesión activa
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "recepcionista_id", nullable = false)
    private Usuario recepcionista;

    @PrePersist
    protected void onCreate() {
        this.fechaCreacion = LocalDateTime.now();
    }
}