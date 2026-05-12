package com.petcare.controllers;
import com.petcare.dto.MascotaDTO;
import com.petcare.services.MascotaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
@RestController
@RequestMapping("/api/mascotas")
@RequiredArgsConstructor
public class MascotaController {
    private final MascotaService mascotaService;
    @GetMapping("/cliente/{clienteId}")
    public ResponseEntity<List<MascotaDTO>> listarPorCliente(@PathVariable Integer clienteId) {
        return ResponseEntity.ok(mascotaService.listarPorCliente(clienteId));
    }
    @GetMapping("/{id}")
    public ResponseEntity<MascotaDTO> buscarPorId(@PathVariable Integer id) {
        return ResponseEntity.ok(mascotaService.buscarPorId(id));
    }
    @PostMapping
    public ResponseEntity<MascotaDTO> crear(@Valid @RequestBody MascotaDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(mascotaService.crear(dto));
    }
    @PutMapping("/{id}")
    public ResponseEntity<MascotaDTO> actualizar(@PathVariable Integer id, @Valid @RequestBody MascotaDTO dto) {
        return ResponseEntity.ok(mascotaService.actualizar(id, dto));
    }
}
