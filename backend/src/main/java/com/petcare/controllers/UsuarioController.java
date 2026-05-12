package com.petcare.controllers;
import com.petcare.dto.UsuarioDTO;
import com.petcare.services.UsuarioService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
@RestController
@RequestMapping("/api/usuarios")
@RequiredArgsConstructor
public class UsuarioController {
    private final UsuarioService usuarioService;
    @GetMapping
    public ResponseEntity<List<UsuarioDTO>> listar() {
        return ResponseEntity.ok(usuarioService.listarTodos());
    }
    @GetMapping("/peluqueros")
    public ResponseEntity<List<UsuarioDTO>> listarPeluqueros() {
        return ResponseEntity.ok(usuarioService.listarPeluqueros());
    }
    @PostMapping
    public ResponseEntity<UsuarioDTO> crear(@Valid @RequestBody UsuarioDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(usuarioService.crear(dto));
    }
    @PatchMapping("/{id}/activar")
    public ResponseEntity<Void> activar(@PathVariable Integer id) {
        usuarioService.cambiarEstado(id, true); return ResponseEntity.ok().build();
    }
    @PatchMapping("/{id}/desactivar")
    public ResponseEntity<Void> desactivar(@PathVariable Integer id) {
        usuarioService.cambiarEstado(id, false); return ResponseEntity.ok().build();
    }
}