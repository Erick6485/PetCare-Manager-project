package com.petcare.services;
import com.petcare.dto.MascotaDTO;
import com.petcare.models.Cliente;
import com.petcare.models.Mascota;
import com.petcare.repositories.ClienteRepository;
import com.petcare.repositories.MascotaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;
@Service
@RequiredArgsConstructor
public class MascotaService {
    private final MascotaRepository mascotaRepository;
    private final ClienteRepository clienteRepository;
    public List<MascotaDTO> listarPorCliente(Integer clienteId) {
        return mascotaRepository.findByCliente_ClienteId(clienteId)
                .stream().map(this::toDTO).collect(Collectors.toList());
    }
    public MascotaDTO buscarPorId(Integer id) {
        return toDTO(mascotaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Mascota no encontrada: " + id)));
    }
    public MascotaDTO crear(MascotaDTO dto) {
        Cliente cliente = clienteRepository.findById(dto.getClienteId())
                .orElseThrow(() -> new RuntimeException("Cliente no encontrado"));
        return toDTO(mascotaRepository.save(toEntity(dto, cliente)));
    }
    public MascotaDTO actualizar(Integer id, MascotaDTO dto) {
        Mascota m = mascotaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Mascota no encontrada: " + id));
        m.setNombre(dto.getNombre()); m.setEspecie(dto.getEspecie());
        m.setRaza(dto.getRaza()); m.setEdad(dto.getEdad());
        m.setPesoKg(dto.getPesoKg()); m.setObservaciones(dto.getObservaciones());
        return toDTO(mascotaRepository.save(m));
    }
    private MascotaDTO toDTO(Mascota m) {
        return MascotaDTO.builder().mascotaId(m.getMascotaId()).nombre(m.getNombre())
                .especie(m.getEspecie()).raza(m.getRaza()).edad(m.getEdad())
                .pesoKg(m.getPesoKg()).observaciones(m.getObservaciones())
                .clienteId(m.getCliente().getClienteId())
                .nombreCliente(m.getCliente().getNombre())
                .fechaCreacion(m.getFechaCreacion()).build();
    }
    private Mascota toEntity(MascotaDTO dto, Cliente cliente) {
        return Mascota.builder().nombre(dto.getNombre()).especie(dto.getEspecie())
                .raza(dto.getRaza()).edad(dto.getEdad()).pesoKg(dto.getPesoKg())
                .observaciones(dto.getObservaciones()).cliente(cliente).build();
    }
}