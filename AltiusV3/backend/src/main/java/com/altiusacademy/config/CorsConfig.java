package com.altiusacademy.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

/**
 * Configuración CORS (Cross-Origin Resource Sharing)
 * 
 * Esta clase configura las políticas CORS que permiten al frontend React
 * comunicarse de forma segura con el backend Spring Boot.
 * 
 * ¿QUÉ ES CORS?
 * CORS es un mecanismo de seguridad implementado por navegadores web que
 * restringe requests HTTP entre diferentes orígenes (protocolo, dominio, puerto).
 * Sin una configuración CORS adecuada, el navegador bloqueará las peticiones
 * del frontend al backend por razones de seguridad.
 * 
 * ARQUITECTURA DE COMUNICACIÓN:
 * ┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
 * │   React App     │───▶│  CORS Headers    │───▶│  Spring Boot    │
 * │ localhost:3000  │    │  Validation      │    │ localhost:8090  │
 * └─────────────────┘    └──────────────────┘    └─────────────────┘
 *                                 │
 * ┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
 * │  Browser CORS   │◀───│  Preflight       │◀───│  OPTIONS        │
 * │  Policy Check   │    │  Request         │    │  Request        │
 * └─────────────────┘    └──────────────────┘    └─────────────────┘
 * 
 * TIPOS DE REQUESTS CORS:
 * 1. Simple Requests: GET, POST con headers básicos
 * 2. Preflight Requests: PUT, DELETE, requests con headers personalizados
 * 
 * CONFIGURACIÓN POR AMBIENTE:
 * - Desarrollo: Orígenes locales (localhost:3000, localhost:3001)
 * - Testing: Orígenes de testing específicos
 * - Producción: Dominios específicos de la aplicación desplegada
 * 
 * @author Development Team
 * @version 3.0
 * @since 2024
 */
@Configuration
public class CorsConfig {

    // ==================== CONFIGURACIÓN DESDE PROPERTIES ====================

    /**
     * Orígenes permitidos para requests CORS
     * 
     * DESARROLLO:
     * - http://localhost:3000 (React development server por defecto)
     * - http://localhost:3001 (React alternative port)
     * - http://localhost:3002 (React testing port)
     * 
     * PRODUCCIÓN:
     * - https://app.altius-academy.com (aplicación principal)
     * - https://www.altius-academy.com (sitio web principal)
     * - https://admin.altius-academy.com (panel administrativo)
     * 
     * IMPORTANTE: En producción, especificar orígenes exactos en lugar de "*"
     * para mayor seguridad. El wildcard "*" no debe usarse con allowCredentials=true.
     */
    @Value("${app.cors.allowed-origins:http://localhost:3000,http://localhost:3001,http://localhost:3002}")
    private String[] allowedOrigins;

    /**
     * Métodos HTTP permitidos para requests CORS
     * 
     * MÉTODOS INCLUIDOS:
     * - GET: Obtener recursos (lectura)
     * - POST: Crear nuevos recursos
     * - PUT: Actualizar recursos completos
     * - PATCH: Actualizar recursos parcialmente
     * - DELETE: Eliminar recursos
     * - OPTIONS: Preflight requests (requerido para CORS)
     * 
     * NOTA: HEAD y TRACE generalmente no se incluyen por seguridad
     */
    @Value("${app.cors.allowed-methods:GET,POST,PUT,DELETE,OPTIONS,PATCH}")
    private String[] allowedMethods;

    /**
     * Headers permitidos en requests CORS
     * 
     * HEADERS COMUNES:
     * - Content-Type: Tipo de contenido del request
     * - Authorization: Token JWT para autenticación
     * - Accept: Tipos de contenido aceptados en la respuesta
     * - Origin: Origen del request (agregado automáticamente por el navegador)
     * - X-Requested-With: Identificador de requests AJAX
     * - Cache-Control: Control de caché
     * 
     * CONFIGURACIÓN:
     * - "*": Permite todos los headers (útil para desarrollo)
     * - Lista específica: Mayor seguridad para producción
     */
    @Value("${app.cors.allowed-headers:*}")
    private String allowedHeaders;

    /**
     * Headers expuestos en responses CORS
     * 
     * Estos headers estarán disponibles para el JavaScript del frontend.
     * Por defecto, solo headers "simples" están disponibles.
     * 
     * HEADERS EXPUESTOS:
     * - Authorization: Para tokens JWT renovados
     * - Content-Type: Tipo de contenido de la respuesta
     * - X-Total-Count: Total de elementos en respuestas paginadas
     * - X-Request-ID: ID único del request para tracking
     * - Location: URL del recurso creado (en responses 201)
     */
    @Value("${app.cors.exposed-headers:Authorization,Content-Type,X-Total-Count,X-Request-ID,Location}")
    private String[] exposedHeaders;

    /**
     * Tiempo de cache para preflight requests (en segundos)
     * 
     * Los navegadores cachearán la respuesta OPTIONS por este tiempo
     * antes de enviar otro preflight request para el mismo endpoint.
     * 
     * VALORES RECOMENDADOS:
     * - Desarrollo: 3600 (1 hora) - permite cambios frecuentes
     * - Producción: 86400 (24 horas) - reduce overhead de preflight
     * - Máximo: 86400 (24 horas) - límite de muchos navegadores
     */
    @Value("${app.cors.max-age:3600}")
    private Long maxAge;

    /**
     * Permitir credenciales en requests CORS
     * 
     * CREDENCIALES INCLUYEN:
     * - Cookies de sesión
     * - Headers de autorización (Authorization)
     * - Certificados de cliente TLS
     * 
     * IMPORTANTE:
     * - Si es true, allowedOrigins NO puede ser "*"
     * - Necesario para enviar tokens JWT en headers Authorization
     * - Requerido para aplicaciones con autenticación
     */
    @Value("${app.cors.allow-credentials:true}")
    private Boolean allowCredentials;

    // ==================== CONFIGURACIÓN CORS PRINCIPAL ====================

    /**
     * Configura la fuente de configuración CORS para toda la aplicación
     * 
     * Esta configuración se aplica a todos los endpoints de la aplicación
     * y define las políticas CORS que los navegadores deben seguir.
     * 
     * PROCESO DE CONFIGURACIÓN:
     * 1. Crear configuración CORS base
     * 2. Establecer orígenes permitidos usando patterns para flexibilidad
     * 3. Configurar métodos HTTP permitidos
     * 4. Establecer headers permitidos y expuestos
     * 5. Configurar credenciales y tiempo de cache
     * 6. Aplicar configuración a todas las rutas (/api/**)
     * 
     * SEGURIDAD:
     * - Usa allowedOriginPatterns en lugar de allowedOrigins para mayor flexibilidad
     * - Valida que allowCredentials sea compatible con los orígenes configurados
     * - Aplica principio de menor privilegio en headers y métodos
     * 
     * @return CorsConfigurationSource configurado para toda la aplicación
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        
        // ==================== CONFIGURACIÓN DE ORÍGENES ====================
        // Usar patterns para mayor flexibilidad (soporta wildcards)
        List<String> origins = Arrays.asList(allowedOrigins);
        configuration.setAllowedOriginPatterns(origins);
        
        // Logging de configuración para debugging
        logger.debug("CORS - Orígenes permitidos: {}", origins);
        
        // ==================== CONFIGURACIÓN DE MÉTODOS ====================
        List<String> methods = Arrays.asList(allowedMethods);
        configuration.setAllowedMethods(methods);
        logger.debug("CORS - Métodos permitidos: {}", methods);
        
        // ==================== CONFIGURACIÓN DE HEADERS ====================
        if ("*".equals(allowedHeaders)) {
            configuration.setAllowedHeaders(List.of("*"));
            logger.debug("CORS - Todos los headers permitidos");
        } else {
            List<String> headers = Arrays.asList(allowedHeaders.split(","));
            configuration.setAllowedHeaders(headers);
            logger.debug("CORS - Headers permitidos: {}", headers);
        }
        
        // ==================== CONFIGURACIÓN DE HEADERS EXPUESTOS ====================
        List<String> exposed = Arrays.asList(exposedHeaders);
        configuration.setExposedHeaders(exposed);
        logger.debug("CORS - Headers expuestos: {}", exposed);
        
        // ==================== CONFIGURACIÓN DE CREDENCIALES ====================
        configuration.setAllowCredentials(allowCredentials);
        logger.debug("CORS - Credenciales permitidas: {}", allowCredentials);
        
        // Validación de seguridad: allowCredentials=true requiere orígenes específicos
        if (allowCredentials && origins.contains("*")) {
            logger.warn("CORS - CONFIGURACIÓN INSEGURA: allowCredentials=true con origen '*' no es permitido por navegadores");
        }
        
        // ==================== CONFIGURACIÓN DE CACHE ====================
        configuration.setMaxAge(maxAge);
        logger.debug("CORS - Tiempo de cache preflight: {} segundos", maxAge);
        
        // ==================== APLICACIÓN DE CONFIGURACIÓN ====================
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        
        // Aplicar a todas las rutas de la API
        source.registerCorsConfiguration("/api/**", configuration);
        
        // Aplicar también a rutas de autenticación específicas
        source.registerCorsConfiguration("/auth/**", configuration);
        
        // Aplicar a endpoints de documentación si es necesario
        source.registerCorsConfiguration("/swagger-ui/**", configuration);
        source.registerCorsConfiguration("/v3/api-docs/**", configuration);
        
        logger.info("CORS configurado exitosamente");
        
        return source;
    }

    // ==================== CONFIGURACIONES ESPECÍFICAS POR AMBIENTE ====================

    /**
     * Configuración CORS específica para desarrollo
     * 
     * Configuración más permisiva para facilitar el desarrollo local.
     * Permite todos los orígenes y headers para evitar problemas durante desarrollo.
     * 
     * CARACTERÍSTICAS:
     * - Orígenes: Todos los localhost con puertos comunes
     * - Headers: Todos permitidos (*)
     * - Métodos: Todos los métodos REST
     * - Credenciales: Habilitadas para testing de autenticación
     * - Cache: Corto para permitir cambios frecuentes
     * 
     * @return CorsConfigurationSource para desarrollo
     */
    @Bean("developmentCorsConfigurationSource")
    public CorsConfigurationSource developmentCorsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        
        // Configuración permisiva para desarrollo
        configuration.setAllowedOriginPatterns(List.of(
            "http://localhost:*",
            "https://localhost:*",
            "http://127.0.0.1:*",
            "https://127.0.0.1:*"
        ));
        
        configuration.setAllowedMethods(List.of("*"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setExposedHeaders(Arrays.asList(exposedHeaders));
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(1800L); // 30 minutos - más corto para desarrollo
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        
        return source;
    }

    /**
     * Configuración CORS específica para producción
     * 
     * Configuración restrictiva y segura para el ambiente de producción.
     * Solo permite orígenes específicos y headers necesarios.
     * 
     * CARACTERÍSTICAS:
     * - Orígenes: Solo dominios específicos de producción
     * - Headers: Lista específica de headers necesarios
     * - Métodos: Solo métodos REST necesarios
     * - Credenciales: Habilitadas para autenticación JWT
     * - Cache: Largo para reducir overhead de preflight
     * 
     * @return CorsConfigurationSource para producción
     */
    @Bean("productionCorsConfigurationSource")
    public CorsConfigurationSource productionCorsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        
        // Configuración restrictiva para producción
        configuration.setAllowedOriginPatterns(List.of(
            "https://app.altius-academy.com",
            "https://www.altius-academy.com",
            "https://admin.altius-academy.com"
        ));
        
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
        
        // Headers específicos para producción
        configuration.setAllowedHeaders(List.of(
            "Content-Type",
            "Authorization",
            "Accept",
            "Origin",
            "User-Agent",
            "Cache-Control",
            "X-Requested-With"
        ));
        
        configuration.setExposedHeaders(Arrays.asList(exposedHeaders));
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(86400L); // 24 horas - cache largo para producción
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/api/**", configuration);
        
        return source;
    }

    // ==================== MÉTODOS DE UTILIDAD ====================

    /**
     * Obtiene información de la configuración CORS actual
     * 
     * Útil para debugging, monitoreo y documentación de la configuración.
     * No incluye información sensible.
     * 
     * @return Map con información de configuración CORS
     */
    public java.util.Map<String, Object> getCorsInfo() {
        java.util.Map<String, Object> info = new java.util.HashMap<>();
        info.put("allowedOrigins", Arrays.asList(allowedOrigins));
        info.put("allowedMethods", Arrays.asList(allowedMethods));
        info.put("allowedHeaders", allowedHeaders);
        info.put("exposedHeaders", Arrays.asList(exposedHeaders));
        info.put("allowCredentials", allowCredentials);
        info.put("maxAge", maxAge);
        return info;
    }

    /**
     * Verifica si un origen está permitido
     * 
     * @param origin Origen a verificar
     * @return true si el origen está permitido, false en caso contrario
     */
    public boolean isOriginAllowed(String origin) {
        if (origin == null || origin.isEmpty()) {
            return false;
        }
        
        return Arrays.asList(allowedOrigins).contains(origin) ||
               Arrays.asList(allowedOrigins).contains("*");
    }

    /**
     * Valida la configuración CORS para detectar problemas de seguridad
     * 
     * @return Lista de advertencias de seguridad encontradas
     */
    public List<String> validateCorsConfiguration() {
        List<String> warnings = new java.util.ArrayList<>();
        
        // Verificar configuración insegura de credenciales con wildcard
        if (allowCredentials && Arrays.asList(allowedOrigins).contains("*")) {
            warnings.add("allowCredentials=true con allowedOrigins='*' no es soportado por navegadores");
        }
        
        // Verificar si se están usando wildcards en producción
        if (Arrays.asList(allowedOrigins).contains("*")) {
            warnings.add("Usar allowedOrigins='*' no es recomendado para producción");
        }
        
        // Verificar tiempo de cache muy largo
        if (maxAge > 86400) {
            warnings.add("maxAge mayor a 24 horas puede no ser respetado por algunos navegadores");
        }
        
        return warnings;
    }

    // ==================== LOGGING ====================
    
    private static final org.slf4j.Logger logger = 
        org.slf4j.LoggerFactory.getLogger(CorsConfig.class);
}