package com.petcare.controllers;
import com.petcare.dto.ClienteDTO;
import com.petcare.services.ClienteService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
@RestController
@RequestMapping("/api/clientes")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('ADMINISTRADOR','RECEPCIONISTA')")
public class ClienteController {
    private final ClienteService clienteService;
    @GetMapping
    public ResponseEntity<List<ClienteDTO>> listar(@RequestParam(required = false) String nombre) {
        if (nombre != null) return ResponseEntity.ok(clienteService.buscarPorNombre(nombre));
        return ResponseEntity.ok(clienteService.listarTodos());
    }
    @GetMapping("/{id}")
    public ResponseEntity<ClienteDTO> buscarPorId(@PathVariable Integer id) {
        return ResponseEntity.ok(clienteService.buscarPorId(id));
    }
    @PostMapping
    public ResponseEntity<ClienteDTO> crear(@Valid @RequestBody ClienteDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(clienteService.crear(dto));
    }
    @PutMapping("/{id}")
    public ResponseEntity<ClienteDTO> actualizar(@PathVariable Integer id, @Valid @RequestBody ClienteDTO dto) {
        return ResponseEntity.ok(clienteService.actualizar(id, dto));
    }
}