package com.petcare.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.LocalDateTime;

/**
 * Entidad que representa la tabla Evidencias.
 * Almacena imágenes antes/después de cada atención.
 */
@Entity
@Table(name = "evidencias")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Evidencia {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "evidenciaid")
    private Integer evidenciaId;

    @Enumerated(EnumType.STRING)
    @JdbcTypeCode(SqlTypes.NAMED_ENUM)
    @Column(name = "tipo", nullable = false)
    private TipoEvidencia tipo;

    @Column(name = "ruta_archivo", nullable = false, length = 500)
    private String rutaArchivo;

    // RNF: máximo 5 MB = 5 242 880 bytes — validado en EvidenciaService
    @Column(name = "tamanio_bytes", nullable = false)
    private Integer tamanioBytes;

    @Column(name = "fecha_subida", nullable = false, updatable = false)
    private LocalDateTime fechaSubida;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "atencion_id", nullable = false)
    private Atencion atencion;

    @PrePersist
    protected void onCreate() {
        this.fechaSubida = LocalDateTime.now();
    }
}
