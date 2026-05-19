package com.petcare.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Entidad que representa la tabla Clientes.
 */
@Entity
@Table(name = "clientes")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Cliente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "clienteid")
    private Integer clienteId;

    @Column(name = "nombre", nullable = false, length = 150)
    private String nombre;

    //Campo único para evitar clientes duplicados
    @Column(name = "documento_identidad", nullable = false, unique = true, length = 30)
    private String documentoIdentidad;

    @Column(name = "telefono", length = 20)
    private String telefono;

    @Column(name = "correo", length = 150)
    private String correo;

    @Column(name = "fecha_creacion", nullable = false, updatable = false)
    private LocalDateTime fechaCreacion;

    @OneToMany(mappedBy = "cliente", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Mascota> mascotas = new ArrayList<>();

    @PrePersist
    protected void onCreate() {
        this.fechaCreacion = LocalDateTime.now();
    }
}