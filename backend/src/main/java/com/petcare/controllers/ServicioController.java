package com.petcare.controllers;
import com.petcare.dto.ServicioDTO;
import com.petcare.services.ServicioService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
@RestController
@RequestMapping("/api/servicios")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('ADMINISTRADOR','RECEPCIONISTA')")
public class ServicioController {
    private final ServicioService servicioService;
    @GetMapping
    public ResponseEntity<List<ServicioDTO>> listar(@RequestParam(defaultValue = "true") boolean soloActivos) {
        return ResponseEntity.ok(soloActivos ? servicioService.listarActivos() : servicioService.listarTodos());
    }
    @PostMapping
    public ResponseEntity<ServicioDTO> crear(@Valid @RequestBody ServicioDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(servicioService.crear(dto));
    }
    @PutMapping("/{id}")
    public ResponseEntity<ServicioDTO> actualizar(@PathVariable Integer id, @Valid @RequestBody ServicioDTO dto) {
        return ResponseEntity.ok(servicioService.actualizar(id, dto));
    }
    @PatchMapping("/{id}/activar")
    public ResponseEntity<Void> activar(@PathVariable Integer id) {
        servicioService.activar(id); return ResponseEntity.ok().build();
    }
    @PatchMapping("/{id}/desactivar")
    public ResponseEntity<Void> desactivar(@PathVariable Integer id) {
        servicioService.desactivar(id); return ResponseEntity.ok().build();
    }
}