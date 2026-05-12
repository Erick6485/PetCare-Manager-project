package com.petcare.dto;

import jakarta.validation.constraints.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class AtencionDTO {
    private Integer atencionId;
    @NotNull(message = "La mascota es obligatoria") private Integer mascotaId;
    @NotNull(message = "El servicio es obligatorio") private Integer servicioId;
    @NotNull(message = "El peluquero es obligatorio") private Integer peluqueroId;
    @NotNull(message = "La fecha es obligatoria") private LocalDate fecha;
    @NotNull(message = "La hora es obligatoria") private LocalTime hora;
    private String observaciones;
    private String estado;
    private String nombreMascota;
    private String nombreCliente;
    private String nombreServicio;
    private String nombrePeluquero;
    private LocalDateTime fechaCreacion;
}