package com.petcare.security;

import java.io.Serializable;

/**
 * Principal autenticado (JWT). El {@code rol} coincide con el nombre en BD (ej. ADMINISTRADOR).
 */
public record PetcarePrincipal(Integer usuarioId, String nombreUsuario, String rol) implements Serializable {
}
