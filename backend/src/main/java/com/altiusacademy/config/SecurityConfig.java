package com.altiusacademy.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.header.writers.ReferrerPolicyHeaderWriter;

import com.altiusacademy.security.CustomUserDetailsService;
import com.altiusacademy.security.JwtAuthenticationEntryPoint;
import com.altiusacademy.security.JwtAuthenticationFilter;

import jakarta.servlet.http.HttpServletResponse;

/**
 * Configuración principal de Spring Security
 * 
 * Esta clase configura la seguridad de la aplicación implementando:
 * - Autenticación basada en JWT (JSON Web Tokens)
 * - Autorización por roles (STUDENT, TEACHER, COORDINATOR, SUPER_ADMIN)
 * - Configuración CORS para permitir requests del frontend
 * - Endpoints públicos y protegidos
 * - Cifrado de contraseñas con BCrypt
 * - Headers de seguridad para protección adicional
 * 
 * ARQUITECTURA DE SEGURIDAD:
 * ┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
 * │   Frontend      │───▶│  JWT Filter      │───▶│  Controllers    │
 * │   (React)       │    │  Authentication  │    │  (Protected)    │
 * └─────────────────┘    └──────────────────┘    └─────────────────┘
 *                                 │
 *                        ┌──────────────────┐
 *                        │  UserDetails     │
 *                        │  Service         │
 *                        └──────────────────┘
 *                                 │
 *                        ┌──────────────────┐
 *                        │  MySQL Database  │
 *                        │  (Users & Roles) │
 *                        └──────────────────┘
 * 
 * @author Development Team
 * @version 3.0
 * @since 2024
 */
@Configuration
@EnableWebSecurity
@EnableMethodSecurity(
    prePostEnabled = true,   // Habilita @PreAuthorize y @PostAuthorize
    securedEnabled = true,   // Habilita @Secured
    jsr250Enabled = true     // Habilita @RolesAllowed
)
public class SecurityConfig {

    // ==================== DEPENDENCIAS ====================
    
    @Autowired
    private JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;

    @Autowired
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @Autowired
    private CustomUserDetailsService customUserDetailsService;

    @Autowired
    private CorsConfig corsConfig;
    
    // Log para verificar que el filtro se inyecta correctamente
    @jakarta.annotation.PostConstruct
    public void init() {
        System.out.println("🔧 SecurityConfig inicializado");
        System.out.println("🔧 JwtAuthenticationFilter: " + (jwtAuthenticationFilter != null ? "INYECTADO ✅" : "NULL ❌"));
    }

    // ==================== CONFIGURACIÓN DESDE PROPERTIES ====================

    /**
     * Fuerza del algoritmo BCrypt para cifrado de contraseñas
     * 
     * Valores recomendados:
     * - Desarrollo: 4-6 (más rápido)
     * - Producción: 10-12 (más seguro)
     * - Alta seguridad: 12-15 (más lento pero muy seguro)
     */
    @Value("${app.security.password.bcrypt-strength:12}")
    private int bcryptStrength;

    /**
     * Habilitar headers HSTS (HTTP Strict Transport Security)
     * 
     * HSTS fuerza a los navegadores a usar HTTPS y previene
     * ataques de downgrade a HTTP.
     */
    @Value("${app.security.headers.hsts-enabled:true}")
    private boolean hstsEnabled;

    /**
     * Duración de HSTS en segundos
     * 
     * Por defecto: 1 año (31536000 segundos)
     */
    @Value("${app.security.headers.hsts-max-age:31536000}")
    private long hstsMaxAge;

    /**
     * Incluir subdominios en HSTS
     */
    @Value("${app.security.headers.hsts-include-subdomains:true}")
    private boolean hstsIncludeSubdomains;

    // ==================== BEANS DE CONFIGURACIÓN ====================

    /**
     * Configurador de cifrado de contraseñas usando BCrypt
     * 
     * BCrypt es un algoritmo de hash adaptativo que incluye:
     * - Salt automático para prevenir ataques de rainbow table
     * - Factor de trabajo configurable para ajustar la seguridad vs rendimiento
     * - Resistencia a ataques de fuerza bruta
     * - Compatibilidad con Spring Security
     * 
     * CARACTERÍSTICAS DE SEGURIDAD:
     * - Algoritmo: Blowfish-based crypt
     * - Salt: 128 bits generado aleatoriamente
     * - Rounds: Configurable (por defecto 12)
     * - Output: 60 caracteres en formato $2a$rounds$salt$hash
     * 
     * @return PasswordEncoder configurado con BCrypt
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(bcryptStrength);
    }

    /**
     * Proveedor de autenticación DAO (Data Access Object)
     * 
     * Configura la autenticación basada en base de datos:
     * - Utiliza CustomUserDetailsService para cargar usuarios desde MySQL
     * - Aplica BCrypt para verificar contraseñas de forma segura
     * - Maneja la lógica de autenticación de usuarios
     * - Integra con el sistema de roles de la aplicación
     * 
     * FLUJO DE AUTENTICACIÓN:
     * 1. Usuario envía credenciales (email/password)
     * 2. CustomUserDetailsService carga usuario desde MySQL
     * 3. BCrypt verifica la contraseña contra el hash almacenado
     * 4. Se crean las autoridades basadas en el rol del usuario
     * 5. Se establece el contexto de seguridad
     * 
     * @return DaoAuthenticationProvider configurado
     */
    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(customUserDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        
        // En desarrollo, mostrar errores detallados
        // En producción, ocultar información sensible
        authProvider.setHideUserNotFoundExceptions(false);
        
        return authProvider;
    }

    /**
     * Administrador de autenticación de Spring Security
     * 
     * Componente central que coordina los proveedores de autenticación
     * y maneja el proceso de autenticación de usuarios.
     * 
     * Este bean es requerido para:
     * - Procesar requests de login en AuthController
     * - Validar credenciales de usuario
     * - Generar tokens JWT tras autenticación exitosa
     * 
     * @param config Configuración de autenticación de Spring
     * @return AuthenticationManager configurado
     * @throws Exception si hay error en la configuración
     */
    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    // ==================== CONFIGURACIÓN PRINCIPAL DE SEGURIDAD ====================

    /**
     * Cadena de filtros de seguridad principal
     * 
     * Define la configuración completa de seguridad de la aplicación:
     * 
     * COMPONENTES PRINCIPALES:
     * 1. CORS: Permite comunicación frontend-backend
     * 2. CSRF: Deshabilitado para APIs REST stateless
     * 3. Sesiones: Stateless (sin sesiones de servidor)
     * 4. Autorización: Basada en roles y endpoints
     * 5. JWT Filter: Procesamiento de tokens JWT
     * 6. Headers de seguridad: Protección adicional
     * 
     * FLUJO DE REQUEST:
     * Request → CORS → CSRF → JWT Filter → Authorization → Controller
     * 
     * @param http Configurador de seguridad HTTP
     * @return SecurityFilterChain configurada
     * @throws Exception si hay error en la configuración
     */
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        return http
            // ==================== CONFIGURACIÓN CORS ====================
            // Permite requests desde el frontend React
            .cors(cors -> cors.configurationSource(corsConfig.corsConfigurationSource()))
            
            // ==================== DESHABILITACIÓN CSRF ====================
            // CSRF no es necesario para APIs REST stateless con JWT
            // Los tokens JWT proporcionan protección contra CSRF
            .csrf(csrf -> csrf.disable())
            
            // ==================== CONFIGURACIÓN DE SESIONES ====================
            // Configuración stateless: no se mantienen sesiones en el servidor
            // Toda la información de autenticación está en el token JWT
            .sessionManagement(session -> 
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            
            // ==================== CONFIGURACIÓN DE AUTORIZACIÓN ====================
            .authorizeHttpRequests(authz -> authz
                
                // ==================== ENDPOINTS COMPLETAMENTE PÚBLICOS ====================
                // Estos endpoints no requieren autenticación ni autorización
                .requestMatchers(
                    // Endpoints básicos del sistema
                    "/", "/error", "/favicon.ico",
                    
                    // Actuator para monitoreo (considerar restringir en producción)
                    "/actuator/**",
                    
                    // Documentación API (Swagger/OpenAPI)
                    "/swagger-ui/**", "/v3/api-docs/**", "/swagger-ui.html",
                    "/swagger-resources/**", "/webjars/**",
                    
                    // Base de datos H2 (solo para desarrollo)
                    "/h2-console/**"
                ).permitAll()
                
                // ==================== ENDPOINTS DE AUTENTICACIÓN ====================
                // Registro, login, recuperación de contraseña
                // Estos endpoints manejan la autenticación inicial
                .requestMatchers(
                    "/api/auth/login",           // Login de usuarios
                    "/api/auth/register",        // Registro de nuevos usuarios
                    "/api/auth/check-coordinator", // Verificar existencia de coordinador
                    "/api/auth/forgot-password", // Recuperación de contraseña
                    "/api/auth/reset-password",  // Reset de contraseña
                    "/api/auth/verify-email",    // Verificación de email
                    "/api/auth/refresh-token"    // Renovación de tokens
                ).permitAll()
                
                // ==================== ENDPOINTS DE CONFIGURACIÓN PÚBLICA ====================
                // Datos necesarios para el funcionamiento básico del frontend
                // Estos datos son requeridos antes de la autenticación
                .requestMatchers(
                    "/api/roles/**",           // Roles disponibles para registro
                    "/api/institutions/**",   // Lista de instituciones para registro
                    "/api/school-grades/**",  // Grados académicos disponibles
                    "/api/simple-grades/**",  // Grados simplificados
                    "/api/academic-grades/**" // Grados académicos completos
                ).permitAll()
                
                // ==================== ENDPOINTS DE UTILIDAD PÚBLICA ====================
                .requestMatchers(
                    "/api/health",                    // Health check del sistema
                    "/api/test/**",                   // Endpoints de testing
                    "/api/init/**",                   // Endpoints de inicialización (SOLO DESARROLLO)
                    "/api/debug/**",                  // Endpoints de debugging (SOLO DESARROLLO)
                    "/api/student-validation/**",    // Validación de estudiantes
                    "/api/tasks/grades",              // Grados para tareas (público)
                    "/api/teacher/tasks/grades"       // Grados para tareas de profesor
                ).permitAll()
                
                // ==================== ENDPOINTS PROTEGIDOS POR ROL ====================
                
                // SUPER_ADMIN: Acceso completo al sistema
                // Puede gestionar usuarios, instituciones, configuración global
                .requestMatchers("/api/super-admin/**", "/api/admin/**")
                    .hasRole("SUPER_ADMIN")
                
                // COORDINATOR: Gestión institucional
                // Puede gestionar profesores, estudiantes y contenido de su institución
                .requestMatchers("/api/coordinator/**", "/api/multi-institution/**")
                    .hasAnyRole("COORDINATOR", "SUPER_ADMIN")
                
                // TEACHER: Gestión académica
                // Puede crear contenido, calificar, gestionar sus clases
                .requestMatchers("/api/teacher/**")
                    .hasAnyRole("TEACHER", "COORDINATOR", "SUPER_ADMIN")
                
                // STUDENT: Acceso a contenido académico
                // Puede ver contenido, realizar tareas, ver calificaciones
                .requestMatchers("/api/student/**")
                    .hasAnyRole("STUDENT", "TEACHER", "COORDINATOR", "SUPER_ADMIN")
                
                // ==================== ENDPOINTS CON MÚLTIPLES ROLES ====================
                
                // Tareas: Accesibles por profesores (crear/editar) y estudiantes (resolver)
                .requestMatchers("/api/tasks/**")
                    .hasAnyRole("TEACHER", "STUDENT", "COORDINATOR", "SUPER_ADMIN")
                
                // Asistencia: Profesores pueden gestionar, estudiantes pueden ver
                .requestMatchers("/api/attendance/**")
                    .hasAnyRole("TEACHER", "STUDENT", "COORDINATOR", "SUPER_ADMIN")
                
                // Actividades interactivas: Profesores crean, estudiantes resuelven
                .requestMatchers("/api/quizzes/**", "/api/activities/**")
                    .hasAnyRole("TEACHER", "STUDENT", "COORDINATOR", "SUPER_ADMIN")
                
                // ==================== ENDPOINTS QUE REQUIEREN AUTENTICACIÓN ====================
                // Estos endpoints requieren estar autenticado pero no un rol específico
                // La autorización específica se maneja con @PreAuthorize en los controladores
                .requestMatchers(
                    "/api/users/**",     // Gestión de usuarios (con @PreAuthorize en controladores)
                    "/api/subjects/**",  // Materias académicas
                    "/api/grades/**",    // Calificaciones
                    "/api/reports/**",   // Reportes del sistema
                    "/api/notifications/**", // Notificaciones
                    "/api/profile/**"    // Perfil de usuario
                ).authenticated()
                
                // ==================== CUALQUIER OTRO ENDPOINT ====================
                // Por defecto, cualquier endpoint no especificado requiere autenticación
                // Esto garantiza que nuevos endpoints sean seguros por defecto
                .anyRequest().authenticated()
            )
            
            // ==================== MANEJO DE EXCEPCIONES ====================
            .exceptionHandling(ex -> ex
                // Manejo personalizado para requests no autenticados
                .authenticationEntryPoint(jwtAuthenticationEntryPoint)
                
                // Manejo personalizado para acceso denegado (usuario autenticado sin permisos)
                .accessDeniedHandler((request, response, accessDeniedException) -> {
                    response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                    response.setContentType("application/json");
                    response.setCharacterEncoding("UTF-8");
                    
                    String jsonResponse = String.format("""
                        {
                            "error": "Acceso denegado",
                            "message": "No tienes permisos para acceder a este recurso",
                            "path": "%s",
                            "method": "%s",
                            "timestamp": "%s",
                            "status": 403
                        }
                        """, 
                        request.getRequestURI(),
                        request.getMethod(),
                        java.time.LocalDateTime.now().toString()
                    );
                    
                    response.getWriter().write(jsonResponse);
                })
            )
            
            // ==================== CONFIGURACIÓN DE HEADERS DE SEGURIDAD ====================
            .headers(headers -> headers
                // Prevenir clickjacking - impide que la página sea mostrada en un frame
                .frameOptions(frameOptions -> frameOptions.deny())
                
                // Prevenir MIME sniffing - fuerza al navegador a respetar el Content-Type
                .contentTypeOptions(contentTypeOptions -> {})
                
                // HTTP Strict Transport Security (HSTS)
                // Fuerza el uso de HTTPS y previene ataques de downgrade
                .httpStrictTransportSecurity(hstsConfig -> {
                    if (hstsEnabled) {
                        hstsConfig
                            .maxAgeInSeconds(hstsMaxAge)
                            .includeSubDomains(hstsIncludeSubdomains);
                    }
                })
                
                // Política de referrer - controla qué información se envía en el header Referer
                .referrerPolicy(referrerPolicy -> 
                    referrerPolicy.policy(ReferrerPolicyHeaderWriter.ReferrerPolicy.STRICT_ORIGIN_WHEN_CROSS_ORIGIN))
                
                // Content Security Policy - previene ataques XSS
                .contentSecurityPolicy(csp -> 
                    csp.policyDirectives("default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'"))
            )
            
            // ==================== CONFIGURACIÓN DE AUTENTICACIÓN ====================
            .authenticationProvider(authenticationProvider())
            
            // ==================== FILTROS PERSONALIZADOS ====================
            // Agregar filtro JWT antes del filtro de autenticación estándar
            // Esto permite que el JWT sea procesado antes de la autenticación normal
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
            
            .build();
    }

    // ==================== MÉTODOS DE UTILIDAD ====================

    /**
     * Obtiene información de la configuración de seguridad actual
     * 
     * Útil para debugging y monitoreo de la configuración.
     * No incluye información sensible como claves secretas.
     * 
     * @return Map con información de configuración de seguridad
     */
    public java.util.Map<String, Object> getSecurityInfo() {
        java.util.Map<String, Object> info = new java.util.HashMap<>();
        info.put("bcryptStrength", bcryptStrength);
        info.put("hstsEnabled", hstsEnabled);
        info.put("hstsMaxAge", hstsMaxAge);
        info.put("hstsIncludeSubdomains", hstsIncludeSubdomains);
        info.put("sessionCreationPolicy", "STATELESS");
        info.put("csrfEnabled", false);
        return info;
    }
}