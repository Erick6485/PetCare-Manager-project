package com.petcare.services;

import com.petcare.dto.LoginRequest;
import com.petcare.dto.LoginResponse;
import com.petcare.models.Usuario;
import com.petcare.repositories.UsuarioRepository;
import com.petcare.security.PetcarePrincipal;
import com.petcare.config.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    @Transactional(readOnly = true)
    public LoginResponse login(LoginRequest req) {
        Usuario u = usuarioRepository.findByNombreUsuarioFetchRol(req.getNombreUsuario().trim())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Credenciales inválidas"));
        if (!Boolean.TRUE.equals(u.getEstadoActividad())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Usuario inactivo");
        }
        if (!passwordEncoder.matches(req.getContrasena(), u.getContrasena())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Credenciales inválidas");
        }
        String rolNombre = u.getRol().getNombre();
        var principal = new PetcarePrincipal(u.getUsuarioId(), u.getNombreUsuario(), rolNombre);
        String token = jwtService.generateToken(principal);
        return LoginResponse.builder()
                .token(token)
                .usuarioId(u.getUsuarioId())
                .nombreCompleto(u.getNombreCompleto())
                .nombreUsuario(u.getNombreUsuario())
                .rol(rolNombre)
                .build();
    }
}
