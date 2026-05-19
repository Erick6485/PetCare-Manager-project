package com.petcare.services;

import com.petcare.config.AppConstants;
import com.petcare.dto.EvidenciaDTO;
import com.petcare.models.Atencion;
import com.petcare.models.Evidencia;
import com.petcare.models.TipoEvidencia;
import com.petcare.repositories.AtencionRepository;
import com.petcare.repositories.EvidenciaRepository;
import com.petcare.security.PetcarePrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Arrays;
import java.util.List;
import java.util.Locale;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EvidenciaService {

    private final EvidenciaRepository evidenciaRepository;
    private final AtencionRepository atencionRepository;

    @Value("${petcare.uploads-dir:uploads}")
    private String uploadsDir;

    @Transactional(readOnly = true)
    public List<EvidenciaDTO> listarPorAtencion(Integer atencionId, PetcarePrincipal principal) {
        Atencion a = atencionRepository.findById(atencionId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Atención no encontrada"));
        assertPuedeVerAtencion(a, principal);
        return evidenciaRepository.findByAtencion_AtencionId(atencionId).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public EvidenciaDTO subir(MultipartFile file, TipoEvidencia tipo, Integer atencionId, PetcarePrincipal principal) {
        validarArchivo(file);
        Atencion a = atencionRepository.findById(atencionId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Atención no encontrada"));
        assertPuedeSubirEvidencia(a, principal);

        String ext = extensionPermitida(file.getOriginalFilename());
        String nombre = UUID.randomUUID() + ext;

        Path base = Paths.get(uploadsDir).toAbsolutePath().normalize();
        Path dir = base.resolve("evidencias").resolve(String.valueOf(atencionId)).normalize();
        if (!dir.startsWith(base)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Ruta inválida");
        }
        try {
            Files.createDirectories(dir);
            Path destino = dir.resolve(nombre).normalize();
            if (!destino.startsWith(dir)) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Ruta inválida");
            }
            Files.copy(file.getInputStream(), destino, StandardCopyOption.REPLACE_EXISTING);
        } catch (IOException e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "No se pudo guardar el archivo");
        }

        String relativa = "evidencias/" + atencionId + "/" + nombre;
        int bytes = (int) Math.min(file.getSize(), Integer.MAX_VALUE);
        Evidencia ev = Evidencia.builder()
                .tipo(tipo)
                .rutaArchivo(relativa)
                .tamanioBytes(bytes)
                .atencion(a)
                .build();
        return toDTO(evidenciaRepository.save(ev));
    }

    @Transactional(readOnly = true)
    public Resource archivo(Integer evidenciaId, PetcarePrincipal principal) {
        Evidencia ev = evidenciaRepository.findById(evidenciaId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Evidencia no encontrada"));
        assertPuedeVerAtencion(ev.getAtencion(), principal);
        Path base = Paths.get(uploadsDir).toAbsolutePath().normalize();
        Path path = base.resolve(ev.getRutaArchivo()).normalize();
        if (!path.startsWith(base)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Ruta inválida");
        }
        if (!Files.isRegularFile(path)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Archivo no encontrado");
        }
        try {
            return new UrlResource(path.toUri());
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "No se pudo leer el archivo");
        }
    }

    private void validarArchivo(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Archivo vacío");
        }
        if (file.getSize() > AppConstants.MAX_TAMANIO_IMAGEN_BYTES) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El archivo supera los 5 MB");
        }
        String ct = file.getContentType();
        if (ct != null) {
            String lower = ct.toLowerCase(Locale.ROOT);
            if (!lower.equals("image/jpeg") && !lower.equals("image/png") && !lower.equals("image/jpg")) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Solo se permiten imágenes JPEG o PNG");
            }
        }
        extensionPermitida(file.getOriginalFilename());
    }

    private String extensionPermitida(String originalFilename) {
        if (originalFilename == null || !originalFilename.contains(".")) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Nombre de archivo inválido");
        }
        String ext = originalFilename.substring(originalFilename.lastIndexOf('.')).toLowerCase(Locale.ROOT);
        if (!ext.equals(".jpg") && !ext.equals(".jpeg") && !ext.equals(".png")) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Extensión no permitida. Use: " + Arrays.toString(AppConstants.FORMATOS_IMAGEN_PERMITIDOS));
        }
        return ext;
    }

    private void assertPuedeVerAtencion(Atencion a, PetcarePrincipal p) {
        if ("PELUQUERO".equals(p.rol()) && !a.getPeluquero().getUsuarioId().equals(p.usuarioId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "No autorizado");
        }
    }

    private void assertPuedeSubirEvidencia(Atencion a, PetcarePrincipal p) {
        if ("PELUQUERO".equals(p.rol())) {
            if (!a.getPeluquero().getUsuarioId().equals(p.usuarioId())) {
                throw new ResponseStatusException(HttpStatus.FORBIDDEN, "No autorizado");
            }
            return;
        }
        if ("ADMINISTRADOR".equals(p.rol()) || "RECEPCIONISTA".equals(p.rol())) {
            return;
        }
        throw new ResponseStatusException(HttpStatus.FORBIDDEN, "No autorizado");
    }

    private EvidenciaDTO toDTO(Evidencia e) {
        String nombre = Paths.get(e.getRutaArchivo()).getFileName().toString();
        return EvidenciaDTO.builder()
                .evidenciaId(e.getEvidenciaId())
                .tipo(e.getTipo().name())
                .atencionId(e.getAtencion().getAtencionId())
                .nombreArchivo(nombre)
                .tamanioBytes(e.getTamanioBytes())
                .fechaSubida(e.getFechaSubida())
                .build();
    }
}
