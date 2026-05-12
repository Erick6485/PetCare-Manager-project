package com.petcare.dto;

import jakarta.validation.constraints.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class MascotaDTO {
    private Integer mascotaId;
    @NotBlank(message = "El nombre es obligatorio") @Size(max = 100) private String nombre;
    @NotBlank(message = "La especie es obligatoria") private String especie;
    private String raza;
    @Min(0) @Max(50) private Integer edad;
    @DecimalMin("0.01") @DecimalMax("999.99") private BigDecimal pesoKg;
    private String observaciones;
    @NotNull(message = "El cliente es obligatorio") private Integer clienteId;
    private String nombreCliente;
    private LocalDateTime fechaCreacion;
}