package com.petcare.dto;

import jakarta.validation.constraints.*;
import lombok.*;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class UsuarioDTO {
    private Integer usuarioId;
    @NotBlank private String nombreCompleto;
    private String telefono;
    @NotBlank @Email private String correo;
    @NotBlank private String nombreUsuario;
    private String contrasena;
    private Boolean estadoActividad;
    @NotNull(message = "El rol es obligatorio") private Integer rolId;
    private String nombreRol;
}