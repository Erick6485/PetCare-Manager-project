package com.petcare.controllers;
import com.petcare.dto.AtencionDTO;
import com.petcare.dto.CambioEstadoRequest;
import com.petcare.services.AtencionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.List;
@RestController
@RequestMapping("/api/atenciones")
@RequiredArgsConstructor
public class AtencionController {
    private final AtencionService atencionService;
    // Dashboard: atenciones del día
    @GetMapping
    public ResponseEntity<List<AtencionDTO>> listar(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fecha) {
        return ResponseEntity.ok(atencionService.listarPorFecha(fecha != null ? fecha : LocalDate.now()));
    }
    // Agenda del peluquero
    @GetMapping("/peluquero/{id}")
    public ResponseEntity<List<AtencionDTO>> agendaPeluquero(
            @PathVariable Integer id,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fecha) {
        return ResponseEntity.ok(atencionService.agendaPeluquero(id, fecha != null ? fecha : LocalDate.now()));
    }
    // Crear atención — recepcionista_id = 1 (temporal hasta implementar sesión)
    @PostMapping
    public ResponseEntity<AtencionDTO> crear(@Valid @RequestBody AtencionDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(atencionService.crear(dto, 1));
    }
    // Cambiar estado
    @PatchMapping("/estado")
    public ResponseEntity<AtencionDTO> cambiarEstado(@Valid @RequestBody CambioEstadoRequest req) {
        return ResponseEntity.ok(atencionService.cambiarEstado(req, 1));
    }
}