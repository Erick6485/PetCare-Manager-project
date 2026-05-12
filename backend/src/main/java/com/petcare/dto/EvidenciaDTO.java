package com.petcare.dto;

import lombok.*;
import java.time.LocalDateTime;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class EvidenciaDTO {
    private Integer evidenciaId;
    private String tipo;
    private String rutaArchivo;
    private Integer tamanioBytes;
    private LocalDateTime fechaSubida;
    private Integer atencionId;
}