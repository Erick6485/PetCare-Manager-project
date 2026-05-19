package com.petcare.repositories;

import com.petcare.models.Cliente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ClienteRepository extends JpaRepository<Cliente, Integer> {

    // Buscar por documento para validar duplicados (RF-03.5)
    Optional<Cliente> findByDocumentoIdentidad(String documentoIdentidad);

    // Buscar por nombre (búsqueda parcial con LIKE)
    List<Cliente> findByNombreContainingIgnoreCase(String nombre);

    // Verificar si ya existe el documento (para validación antes de crear)
    boolean existsByDocumentoIdentidad(String documentoIdentidad);
}