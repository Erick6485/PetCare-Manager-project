package com.petcare.controllers;

import com.petcare.dto.AtencionDTO;
import com.petcare.dto.CambioEstadoRequest;
import com.petcare.security.PetcarePrincipal;
import com.petcare.security.SecurityUtils;
import com.petcare.services.AtencionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/atenciones")
@RequiredArgsConstructor
public class AtencionController {
    private final AtencionService atencionService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMINISTRADOR','RECEPCIONISTA')")
    public ResponseEntity<List<AtencionDTO>> listar(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fecha) {
        return ResponseEntity.ok(atencionService.listarPorFecha(fecha != null ? fecha : LocalDate.now()));
    }

    @GetMapping("/peluquero/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<AtencionDTO>> agendaPeluquero(
            @PathVariable Integer id,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fecha) {
        PetcarePrincipal p = SecurityUtils.requirePrincipal();
        if ("PELUQUERO".equals(p.rol()) && !id.equals(p.usuarioId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        return ResponseEntity.ok(atencionService.agendaPeluquero(id, fecha != null ? fecha : LocalDate.now()));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMINISTRADOR','RECEPCIONISTA')")
    public ResponseEntity<AtencionDTO> crear(@Valid @RequestBody AtencionDTO dto) {
        Integer recepcionistaId = SecurityUtils.requirePrincipal().usuarioId();
        return ResponseEntity.status(HttpStatus.CREATED).body(atencionService.crear(dto, recepcionistaId));
    }

    @PatchMapping("/estado")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<AtencionDTO> cambiarEstado(@Valid @RequestBody CambioEstadoRequest req) {
        PetcarePrincipal p = SecurityUtils.requirePrincipal();
        return ResponseEntity.ok(atencionService.cambiarEstado(req, p.usuarioId(), p.rol()));
    }
}
