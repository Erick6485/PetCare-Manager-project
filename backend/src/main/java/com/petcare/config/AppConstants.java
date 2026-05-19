package com.petcare.config;
public final class AppConstants {
    private AppConstants() {}
    public static final int MAX_SERVICIOS_SIMULTANEOS = 3;
    public static final int MAX_INTENTOS_LOGIN = 5;
    public static final int MINUTOS_EXPIRACION_SESION = 30;
    public static final int MAX_TAMANIO_IMAGEN_BYTES = 5 * 1024 * 1024;
    public static final String[] FORMATOS_IMAGEN_PERMITIDOS = {"JPEG", "JPG", "PNG"};
}