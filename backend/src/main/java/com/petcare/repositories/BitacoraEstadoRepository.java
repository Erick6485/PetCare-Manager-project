package com.petcare.repositories;

import com.petcare.models.BitacoraEstado;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BitacoraEstadoRepository extends JpaRepository<BitacoraEstado, Integer> {

    // Historial completo de cambios de una atención
    List<BitacoraEstado> findByAtencion_AtencionIdOrderByFechaHoraAsc(Integer atencionId);
}