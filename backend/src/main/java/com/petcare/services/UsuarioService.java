package com.petcare.services;
import com.petcare.dto.UsuarioDTO;
import com.petcare.models.Rol;
import com.petcare.models.Usuario;
import com.petcare.repositories.RolRepository;
import com.petcare.repositories.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;
@Service
@RequiredArgsConstructor
public class UsuarioService {
    private final UsuarioRepository usuarioRepository;
    private final RolRepository rolRepository;
    private final PasswordEncoder passwordEncoder;
    public List<UsuarioDTO> listarTodos() {
        return usuarioRepository.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }
    public List<UsuarioDTO> listarPeluqueros() {
        return usuarioRepository.findByRol_NombreAndEstadoActividadTrue("PELUQUERO")
                .stream().map(this::toDTO).collect(Collectors.toList());
    }
    public UsuarioDTO crear(UsuarioDTO dto) {
        if (usuarioRepository.existsByNombreUsuario(dto.getNombreUsuario()))
            throw new RuntimeException("El nombre de usuario ya existe");
        if (usuarioRepository.existsByCorreo(dto.getCorreo()))
            throw new RuntimeException("El correo ya está registrado");
        Rol rol = rolRepository.findById(dto.getRolId())
                .orElseThrow(() -> new RuntimeException("Rol no encontrado"));
        String hash = passwordEncoder.encode(dto.getContrasena());
        Usuario u = Usuario.builder().nombreCompleto(dto.getNombreCompleto())
                .telefono(dto.getTelefono()).correo(dto.getCorreo())
                .nombreUsuario(dto.getNombreUsuario()).contrasena(hash).rol(rol).build();
        return toDTO(usuarioRepository.save(u));
    }
    public void cambiarEstado(Integer id, boolean activo) {
        Usuario u = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        u.setEstadoActividad(activo); usuarioRepository.save(u);
    }
    private UsuarioDTO toDTO(Usuario u) {
        return UsuarioDTO.builder().usuarioId(u.getUsuarioId())
                .nombreCompleto(u.getNombreCompleto()).telefono(u.getTelefono())
                .correo(u.getCorreo()).nombreUsuario(u.getNombreUsuario())
                .estadoActividad(u.getEstadoActividad())
                .rolId(u.getRol().getRolId()).nombreRol(u.getRol().getNombre()).build();
    }
}