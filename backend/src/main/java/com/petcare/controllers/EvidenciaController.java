package com.petcare.controllers;

import com.petcare.dto.EvidenciaDTO;
import com.petcare.models.TipoEvidencia;
import com.petcare.security.SecurityUtils;
import com.petcare.services.EvidenciaService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Locale;

@RestController
@RequestMapping("/api/evidencias")
@RequiredArgsConstructor
public class EvidenciaController {

    private final EvidenciaService evidenciaService;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<EvidenciaDTO> subir(
            @RequestParam("file") MultipartFile file,
            @RequestParam("tipo") String tipo,
            @RequestParam("atencionId") Integer atencionId) {
        TipoEvidencia t;
        try {
            t = TipoEvidencia.valueOf(tipo.trim().toUpperCase(Locale.ROOT));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
        EvidenciaDTO dto = evidenciaService.subir(file, t, atencionId, SecurityUtils.requirePrincipal());
        return ResponseEntity.status(201).body(dto);
    }

    @GetMapping("/atencion/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<EvidenciaDTO>> listarPorAtencion(@PathVariable("id") Integer atencionId) {
        return ResponseEntity.ok(evidenciaService.listarPorAtencion(atencionId, SecurityUtils.requirePrincipal()));
    }

    @GetMapping("/archivo/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Resource> archivo(@PathVariable Integer id) {
        Resource resource = evidenciaService.archivo(id, SecurityUtils.requirePrincipal());
        String name = resource.getFilename() != null ? resource.getFilename() : "evidencia";
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + name + "\"")
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(resource);
    }
}
