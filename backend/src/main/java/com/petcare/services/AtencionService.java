package com.petcare.services;
import com.petcare.config.AppConstants;
import com.petcare.dto.AtencionDTO;
import com.petcare.dto.CambioEstadoRequest;
import com.petcare.models.*;
import com.petcare.repositories.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;
@Service
@RequiredArgsConstructor
public class AtencionService {
    private final AtencionRepository atencionRepository;
    private final MascotaRepository mascotaRepository;
    private final ServicioRepository servicioRepository;
    private final UsuarioRepository usuarioRepository;
    private final BitacoraEstadoRepository bitacoraRepository;
    public List<AtencionDTO> listarPorFecha(LocalDate fecha) {
        return atencionRepository.findByFecha(fecha).stream().map(this::toDTO).collect(Collectors.toList());
    }
    public List<AtencionDTO> agendaPeluquero(Integer peluqueroId, LocalDate fecha) {
        return atencionRepository.findByPeluquero_UsuarioIdAndFechaOrderByHoraAsc(peluqueroId, fecha)
                .stream().map(this::toDTO).collect(Collectors.toList());
    }
    public AtencionDTO crear(AtencionDTO dto, Integer recepcionistaId) {
        long carga = atencionRepository.contarAtencionesActivasPeluquero(
                dto.getPeluqueroId(), dto.getFecha(), dto.getHora());
        if (carga >= AppConstants.MAX_SERVICIOS_SIMULTANEOS)
            throw new RuntimeException("El peluquero ya tiene el máximo de servicios en ese horario");
        Mascota mascota = mascotaRepository.findById(dto.getMascotaId())
                .orElseThrow(() -> new RuntimeException("Mascota no encontrada"));
        Servicio servicio = servicioRepository.findById(dto.getServicioId())
                .orElseThrow(() -> new RuntimeException("Servicio no encontrado"));
        Usuario peluquero = usuarioRepository.findById(dto.getPeluqueroId())
                .orElseThrow(() -> new RuntimeException("Peluquero no encontrado"));
        Usuario recepcionista = usuarioRepository.findById(recepcionistaId)
                .orElseThrow(() -> new RuntimeException("Recepcionista no encontrada"));
        Atencion atencion = Atencion.builder().mascota(mascota).servicio(servicio)
                .peluquero(peluquero).recepcionista(recepcionista)
                .fecha(dto.getFecha()).hora(dto.getHora()).observaciones(dto.getObservaciones()).build();
        return toDTO(atencionRepository.save(atencion));
    }
    public AtencionDTO cambiarEstado(CambioEstadoRequest req, Integer usuarioId, String rol) {
        Atencion a = atencionRepository.findById(req.getAtencionId())
                .orElseThrow(() -> new RuntimeException("Atención no encontrada"));
        if ("PELUQUERO".equals(rol) && !a.getPeluquero().getUsuarioId().equals(usuarioId)) {
            throw new RuntimeException("No autorizado para modificar esta atención");
        }
        EstadoAtencion anterior = a.getEstado();
        EstadoAtencion nuevo = EstadoAtencion.valueOf(req.getNuevoEstado());
        validarTransicion(anterior, nuevo);
        if (req.getObservaciones() != null) a.setObservaciones(req.getObservaciones());
        a.setEstado(nuevo);
        atencionRepository.save(a);
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        bitacoraRepository.save(BitacoraEstado.builder().atencion(a).usuario(usuario)
                .estadoAnterior(anterior.name()).estadoNuevo(nuevo.name()).build());
        return toDTO(a);
    }
    private void validarTransicion(EstadoAtencion desde, EstadoAtencion hacia) {
        boolean valida = switch (desde) {
            case PENDIENTE  -> hacia == EstadoAtencion.EN_PROCESO || hacia == EstadoAtencion.CANCELADO;
            case EN_PROCESO -> hacia == EstadoAtencion.FINALIZADO;
            default         -> false;
        };
        if (!valida) throw new RuntimeException("Transición inválida: " + desde + " → " + hacia);
    }
    private AtencionDTO toDTO(Atencion a) {
        return AtencionDTO.builder().atencionId(a.getAtencionId()).estado(a.getEstado().name())
                .fecha(a.getFecha()).hora(a.getHora()).observaciones(a.getObservaciones())
                .mascotaId(a.getMascota().getMascotaId()).nombreMascota(a.getMascota().getNombre())
                .nombreCliente(a.getMascota().getCliente().getNombre())
                .servicioId(a.getServicio().getServicioId()).nombreServicio(a.getServicio().getNombre())
                .peluqueroId(a.getPeluquero().getUsuarioId()).nombrePeluquero(a.getPeluquero().getNombreCompleto())
                .fechaCreacion(a.getFechaCreacion()).build();
    }
}