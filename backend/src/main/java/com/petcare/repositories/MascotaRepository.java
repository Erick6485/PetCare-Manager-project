package com.petcare.repositories;

import com.petcare.models.Mascota;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MascotaRepository extends JpaRepository<Mascota, Integer> {

    // Obtener todas las mascotas de un cliente
    List<Mascota> findByCliente_ClienteId(Integer clienteId);

    // Buscar por nombre (búsqueda parcial)
    List<Mascota> findByNombreContainingIgnoreCase(String nombre);
}