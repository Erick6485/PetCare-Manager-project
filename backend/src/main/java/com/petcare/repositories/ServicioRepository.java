package com.petcare.repositories;

import com.petcare.models.Servicio;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ServicioRepository extends JpaRepository<Servicio, Integer> {

    // Solo servicios activos para mostrar en el formulario de asignación
    List<Servicio> findByActivoTrue();
}