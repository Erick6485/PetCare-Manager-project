package com.petcare.dto;

import jakarta.validation.constraints.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class ServicioDTO {
    private Integer servicioId;
    @NotBlank(message = "El nombre es obligatorio") @Size(max = 120) private String nombre;
    private String descripcion;
    @NotNull(message = "El precio es obligatorio") @DecimalMin("0.00") private BigDecimal precio;
    private Boolean activo;
    private LocalDateTime fechaCreacion;
}