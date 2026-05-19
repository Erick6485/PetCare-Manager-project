package com.petcare.config;

import com.petcare.security.PetcarePrincipal;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.Optional;

@Service
public class JwtService {

    private final SecretKey key;
    private final long expirationMs;

    public JwtService(
            @Value("${jwt.secret}") String secret,
            @Value("${jwt.expiration-ms}") long expirationMs) {
        byte[] bytes = secret.length() >= 64
                ? Decoders.BASE64.decode(secret)
                : secret.getBytes(StandardCharsets.UTF_8);
        this.key = Keys.hmacShaKeyFor(bytes.length >= 32 ? bytes : padSecret(bytes));
        this.expirationMs = expirationMs;
    }

    private static byte[] padSecret(byte[] bytes) {
        byte[] padded = new byte[32];
        System.arraycopy(bytes, 0, padded, 0, Math.min(bytes.length, 32));
        return padded;
    }

    public String generateToken(PetcarePrincipal principal) {
        Date now = new Date();
        Date exp = new Date(now.getTime() + expirationMs);
        return Jwts.builder()
                .subject(String.valueOf(principal.usuarioId()))
                .claim("nombreUsuario", principal.nombreUsuario())
                .claim("rol", principal.rol())
                .issuedAt(now)
                .expiration(exp)
                .signWith(key)
                .compact();
    }

    public Optional<PetcarePrincipal> parsePrincipal(String token) {
        try {
            Claims claims = Jwts.parser()
                    .verifyWith(key)
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();
            Integer usuarioId = Integer.parseInt(claims.getSubject());
            String nombreUsuario = claims.get("nombreUsuario", String.class);
            String rol = claims.get("rol", String.class);
            return Optional.of(new PetcarePrincipal(usuarioId, nombreUsuario, rol));
        } catch (Exception e) {
            return Optional.empty();
        }
    }
}
