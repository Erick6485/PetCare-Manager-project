package com.petcare.security;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

public final class SecurityUtils {
    private SecurityUtils() {}

    public static PetcarePrincipal requirePrincipal() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !(auth.getPrincipal() instanceof PetcarePrincipal p)) {
            throw new IllegalStateException("Usuario no autenticado");
        }
        return p;
    }
}
