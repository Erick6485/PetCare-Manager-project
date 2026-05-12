package com.petcare.repositories;

import com.petcare.models.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Integer> {

    Optional<Usuario> findByNombreUsuario(String nombreUsuario);

    boolean existsByNombreUsuario(String nombreUsuario);

    boolean existsByCorreo(String correo);

    // Obtener todos los peluqueros activos para mostrar en el formulario
    List<Usuario> findByRol_NombreAndEstadoActividadTrue(String rolNombre);
}