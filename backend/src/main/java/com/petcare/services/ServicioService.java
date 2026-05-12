package com.petcare.services;
import com.petcare.dto.ServicioDTO;
import com.petcare.models.Servicio;
import com.petcare.repositories.ServicioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;
@Service
@RequiredArgsConstructor
public class ServicioService {
    private final ServicioRepository servicioRepository;
    public List<ServicioDTO> listarActivos() {
        return servicioRepository.findByActivoTrue().stream().map(this::toDTO).collect(Collectors.toList());
    }
    public List<ServicioDTO> listarTodos() {
        return servicioRepository.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }
    public ServicioDTO crear(ServicioDTO dto) {
        return toDTO(servicioRepository.save(toEntity(dto)));
    }
    public ServicioDTO actualizar(Integer id, ServicioDTO dto) {
        Servicio s = servicioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Servicio no encontrado: " + id));
        s.setNombre(dto.getNombre()); s.setDescripcion(dto.getDescripcion()); s.setPrecio(dto.getPrecio());
        return toDTO(servicioRepository.save(s));
    }
    public void activar(Integer id)    { cambiarEstado(id, true); }
    public void desactivar(Integer id) { cambiarEstado(id, false); }
    private void cambiarEstado(Integer id, boolean activo) {
        Servicio s = servicioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Servicio no encontrado: " + id));
        s.setActivo(activo); servicioRepository.save(s);
    }
    private ServicioDTO toDTO(Servicio s) {
        return ServicioDTO.builder().servicioId(s.getServicioId()).nombre(s.getNombre())
                .descripcion(s.getDescripcion()).precio(s.getPrecio())
                .activo(s.getActivo()).fechaCreacion(s.getFechaCreacion()).build();
    }
    private Servicio toEntity(ServicioDTO dto) {
        return Servicio.builder().nombre(dto.getNombre())
                .descripcion(dto.getDescripcion()).precio(dto.getPrecio()).build();
    }
}