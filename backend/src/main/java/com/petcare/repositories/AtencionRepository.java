package com.petcare.repositories;

import com.petcare.models.Atencion;
import com.petcare.models.EstadoAtencion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Repository
public interface AtencionRepository extends JpaRepository<Atencion, Integer> {

    // Dashboard: atenciones del día filtradas por estado
    List<Atencion> findByFechaAndEstado(LocalDate fecha, EstadoAtencion estado);

    // Dashboard: todas las atenciones de una fecha
    List<Atencion> findByFecha(LocalDate fecha);

    // Validación de carga laboral (AppConstants.MAX_SERVICIOS_SIMULTANEOS = 3)
    // Cuenta cuántas atenciones activas tiene el peluquero en esa fecha y hora
    @Query("""
        SELECT COUNT(a) FROM Atencion a
        WHERE a.peluquero.usuarioId = :peluqueroId
          AND a.fecha = :fecha
          AND a.hora = :hora
          AND a.estado NOT IN ('FINALIZADO', 'CANCELADO')
    """)
    long contarAtencionesActivasPeluquero(
            @Param("peluqueroId") Integer peluqueroId,
            @Param("fecha") LocalDate fecha,
            @Param("hora") LocalTime hora
    );

    // Agenda diaria del peluquero
    List<Atencion> findByPeluquero_UsuarioIdAndFechaOrderByHoraAsc(
            Integer peluqueroId, LocalDate fecha);
}