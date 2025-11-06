package com.altiusacademy.security;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.MediaType;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.time.LocalDateTime;

/**
 * Punto de entrada para manejo de errores de autenticación JWT
 * 
 * Esta clase maneja requests no autenticados devolviendo respuestas JSON
 * en lugar de páginas HTML, lo cual es necesario para aplicaciones React.
 * 
 * Se ejecuta cuando un usuario intenta acceder a un recurso protegido
 * sin estar autenticado o con credenciales inválidas.
 */
@Component
public class JwtAuthenticationEntryPoint implements AuthenticationEntryPoint {

    private static final Logger logger = LoggerFactory.getLogger(JwtAuthenticationEntryPoint.class);

    /**
     * Maneja requests no autenticados devolviendo una respuesta JSON simple
     * 
     * @param request       Request HTTP que causó el error de autenticación
     * @param response      Response HTTP donde escribir la respuesta de error
     * @param authException Excepción de autenticación que causó el error
     * @throws IOException      si hay error escribiendo la respuesta
     * @throws ServletException si hay error en el procesamiento del servlet
     */
    @Override
    public void commence(HttpServletRequest request,
            HttpServletResponse response,
            AuthenticationException authException)
            throws IOException, ServletException {

        String requestPath = request.getRequestURI();
        String method = request.getMethod();
        // Log del intento de acceso no autorizado
        logger.warn("Acceso no autorizado: {} {} - Error: {}",
                method, requestPath, authException.getMessage());

        // Configurar respuesta JSON
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.setCharacterEncoding("UTF-8");

        // Respuesta JSON simple
        String jsonResponse = String.format("""
                {
                    "error": "Acceso no autorizado",
                    "message": "%s",
                    "path": "%s",
                    "timestamp": "%s",
                    "status": 401
                }
                """,
                authException.getMessage(),
                requestPath,
                LocalDateTime.now());

        response.getWriter().write(jsonResponse);
        response.getWriter().flush();
    }

}