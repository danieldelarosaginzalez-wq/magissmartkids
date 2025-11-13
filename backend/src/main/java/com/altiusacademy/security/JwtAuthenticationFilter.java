package com.altiusacademy.security;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

/**
 * Filtro de autenticación JWT
 * 
 * Extrae tokens JWT del header Authorization, los valida y establece
 * el contexto de seguridad para usuarios autenticados.
 * 
 * @author Development Team
 * @version 3.0
 * @since 2024
 */
@org.springframework.stereotype.Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private static final Logger logger = LoggerFactory.getLogger(JwtAuthenticationFilter.class);
    private static final String BEARER_PREFIX = "Bearer ";
    private static final String AUTHORIZATION_HEADER = "Authorization";

    @org.springframework.beans.factory.annotation.Autowired
    private JwtTokenProvider tokenProvider;

    @org.springframework.beans.factory.annotation.Autowired
    private CustomUserDetailsService customUserDetailsService;

    /**
     * Rutas públicas que no requieren autenticación JWT
     * IMPORTANTE: Usar rutas específicas para evitar matches incorrectos
     * NO incluir "/" solo porque hace match con todas las rutas
     */
    private static final List<String> PUBLIC_PATHS = Arrays.asList(
        "/api/auth/",
        "/api/roles/",
        "/api/school-grades/",
        "/api/simple-grades/",
        "/api/academic-grades/",
        "/api/health",
        "/api/test/",
        "/api/debug/",
        "/api/init/",
        "/api/student-validation/",
        "/actuator/",
        "/swagger-ui/",
        "/v3/api-docs/",
        "/h2-console/",
        "/error",
        "/favicon.ico"
    );

    /**
     * Procesa cada request HTTP para autenticación JWT
     */
    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request, 
                                    @NonNull HttpServletResponse response, 
                                    @NonNull FilterChain filterChain) 
                                    throws ServletException, IOException {
        
        String requestPath = request.getRequestURI();
        String authHeader = request.getHeader(AUTHORIZATION_HEADER);
        
        logger.info("🔍 JWT Filter EJECUTÁNDOSE - Path: {}, Authorization Header: {}", 
            requestPath, authHeader != null ? "Presente" : "Ausente");
        
        // Omitir rutas públicas
        if (isPublicPath(requestPath)) {
            logger.info("✅ Ruta pública detectada, omitiendo JWT: {}", requestPath);
            filterChain.doFilter(request, response);
            return;
        }
        
        try {
            // Extraer y procesar token JWT
            String jwt = extractJwtFromRequest(request);
            
            logger.info("🔑 JWT Filter - Path: {}, Token extraído: {}", requestPath, jwt != null);
            
            if (StringUtils.hasText(jwt)) {
                logger.info("🔑 Token presente, validando...");
                
                if (tokenProvider.validateToken(jwt)) {
                    logger.info("✅ Token válido");
                    String username = tokenProvider.getUsernameFromToken(jwt);
                    logger.info("👤 Username del token: {}", username);
                    
                    if (StringUtils.hasText(username) && SecurityContextHolder.getContext().getAuthentication() == null) {
                        UserDetails userDetails = customUserDetailsService.loadUserByUsername(username);
                        logger.info("👥 UserDetails cargado, roles: {}", userDetails.getAuthorities());
                        
                        UsernamePasswordAuthenticationToken authentication = 
                            new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                        authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                        
                        SecurityContextHolder.getContext().setAuthentication(authentication);
                        logger.info("✅ Autenticación JWT establecida para: {}", username);
                    }
                } else {
                    logger.warn("❌ Token inválido");
                }
            } else {
                logger.warn("⚠️ No se encontró token JWT en el request para: {}", requestPath);
                logger.warn("⚠️ Authorization header completo: {}", authHeader);
            }
            
        } catch (Exception ex) {
            logger.error("❌ Error procesando autenticación JWT: {}", ex.getMessage(), ex);
        }

        filterChain.doFilter(request, response);
    }

    /**
     * Verifica si una ruta es pública
     */
    private boolean isPublicPath(String path) {
        boolean isPublic = PUBLIC_PATHS.stream().anyMatch(publicPath -> {
            boolean matches = path.startsWith(publicPath);
            if (matches) {
                logger.info("🔍 Ruta {} hace match con patrón público: {}", path, publicPath);
            }
            return matches;
        });
        
        if (!isPublic) {
            logger.info("🔒 Ruta {} NO es pública, requiere autenticación", path);
        }
        
        return isPublic;
    }

    /**
     * Extrae el token JWT del header Authorization
     */
    private String extractJwtFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader(AUTHORIZATION_HEADER);
        
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith(BEARER_PREFIX)) {
            return bearerToken.substring(BEARER_PREFIX.length());
        }
        
        return null;
    }
}