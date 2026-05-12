package com.petcare.models;

/**
 * Enum que representa los estados posibles de una atención.
 * Debe coincidir con el tipo ENUM estado_atencion creado en PostgreSQL (V5).
 *
 * Transiciones válidas:
 *   PENDIENTE → EN_PROCESO → FINALIZADO
 *   PENDIENTE → CANCELADO
 */
public enum EstadoAtencion {
    PENDIENTE,
    EN_PROCESO,
    FINALIZADO,
    CANCELADO
}