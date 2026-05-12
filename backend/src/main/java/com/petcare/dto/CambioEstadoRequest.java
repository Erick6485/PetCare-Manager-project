package com.petcare.dto;

import jakarta.validation.constraints.*;
import lombok.*;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class CambioEstadoRequest {
    @NotNull(message = "El ID de la atención es obligatorio") private Integer atencionId;
    @NotBlank(message = "El nuevo estado es obligatorio") private String nuevoEstado;
    private String observaciones;
}