package com.petcare.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EvidenciaDTO {
    private Integer evidenciaId;
    private String tipo;
    private Integer atencionId;
    private String nombreArchivo;
    private Integer tamanioBytes;
    private LocalDateTime fechaSubida;
}
