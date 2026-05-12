package com.petcare.dto;

import jakarta.validation.constraints.*;
import lombok.*;
import java.time.LocalDateTime;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class ClienteDTO {
    private Integer clienteId;
    @NotBlank(message = "El nombre es obligatorio") @Size(max = 150)
    private String nombre;
    @NotBlank(message = "El documento es obligatorio") @Size(max = 30)
    private String documentoIdentidad;
    @Size(max = 20) private String telefono;
    @Email(message = "Correo inválido") private String correo;
    private LocalDateTime fechaCreacion;
}