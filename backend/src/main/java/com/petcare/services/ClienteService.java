package com.petcare.services;
import com.petcare.dto.ClienteDTO;
import com.petcare.models.Cliente;
import com.petcare.repositories.ClienteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;
@Service
@RequiredArgsConstructor
public class ClienteService {
    private final ClienteRepository clienteRepository;
    public List<ClienteDTO> listarTodos() {
        return clienteRepository.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }
    public ClienteDTO buscarPorId(Integer id) {
        return toDTO(clienteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cliente no encontrado: " + id)));
    }
    public List<ClienteDTO> buscarPorNombre(String nombre) {
        return clienteRepository.findByNombreContainingIgnoreCase(nombre)
                .stream().map(this::toDTO).collect(Collectors.toList());
    }
    public ClienteDTO crear(ClienteDTO dto) {
        if (clienteRepository.existsByDocumentoIdentidad(dto.getDocumentoIdentidad()))
            throw new RuntimeException("Ya existe un cliente con ese documento");
        return toDTO(clienteRepository.save(toEntity(dto)));
    }
    public ClienteDTO actualizar(Integer id, ClienteDTO dto) {
        Cliente c = clienteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cliente no encontrado: " + id));
        c.setNombre(dto.getNombre()); c.setTelefono(dto.getTelefono()); c.setCorreo(dto.getCorreo());
        return toDTO(clienteRepository.save(c));
    }
    private ClienteDTO toDTO(Cliente c) {
        return ClienteDTO.builder().clienteId(c.getClienteId()).nombre(c.getNombre())
                .documentoIdentidad(c.getDocumentoIdentidad()).telefono(c.getTelefono())
                .correo(c.getCorreo()).fechaCreacion(c.getFechaCreacion()).build();
    }
    private Cliente toEntity(ClienteDTO dto) {
        return Cliente.builder().nombre(dto.getNombre())
                .documentoIdentidad(dto.getDocumentoIdentidad())
                .telefono(dto.getTelefono()).correo(dto.getCorreo()).build();
    }
}