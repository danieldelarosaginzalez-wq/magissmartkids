package com.altiusacademy.config;

import org.springframework.beans.factory.annotation.Autowired;
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

import com.altiusacademy.security.CustomUserDetailsService;
import com.altiusacademy.security.JwtAuthenticationEntryPoint;
import com.altiusacademy.security.JwtAuthenticationFilter;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
public class SecurityConfig {

    @Autowired
    private JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;

    @Autowired
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @Autowired
    private CustomUserDetailsService customUserDetailsService;

    @Autowired
    private CorsConfig corsConfig;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(customUserDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        return http
            .cors(cors -> cors.configurationSource(corsConfig.corsConfigurationSource()))
            .csrf(csrf -> csrf.disable())
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(authz -> authz
                // Public endpoints - ORDEN IMPORTANTE: Los más específicos primero
                .requestMatchers("/", "/error").permitAll()
                .requestMatchers("/api/auth/**").permitAll() // Autenticación pública
                .requestMatchers("/api/roles/**").permitAll() // Roles públicos
                .requestMatchers("/api/institutions/**").permitAll() // Instituciones públicas
                .requestMatchers("/api/school-grades/**").permitAll() // Grados escolares públicos
                .requestMatchers("/api/simple-grades/**").permitAll() // Grados simples públicos
                .requestMatchers("/api/student-validation/**").permitAll() // Validación estudiantes pública
                .requestMatchers("/api/test/**").permitAll() // Test endpoints públicos
                .requestMatchers("/api/health").permitAll() // Health check público
                .requestMatchers("/api/academic-grades/**").permitAll() // Grados académicos públicos
                .requestMatchers("/actuator/**").permitAll()
                .requestMatchers("/swagger-ui/**", "/v3/api-docs/**", "/swagger-ui.html").permitAll()
                .requestMatchers("/h2-console/**").permitAll()
                // Protected endpoints
                .requestMatchers("/api/quizzes/**").hasAnyRole("PROFESOR", "ESTUDIANTE")
                .requestMatchers("/api/attendance/**").hasAnyRole("PROFESOR", "ESTUDIANTE")
                .requestMatchers("/api/tasks/**").hasAnyRole("TEACHER", "STUDENT")
                .requestMatchers("/api/users/**").authenticated() // Usuarios requieren autenticación
                .requestMatchers("/api/subjects/**").authenticated() // Materias requieren autenticación
                .requestMatchers("/api/super-admin/**").hasRole("SUPER_ADMIN") // Super Admin endpoints
                .requestMatchers("/api/admin/**").hasRole("ADMIN") // Admin endpoints
                .requestMatchers("/api/teacher/**").hasRole("TEACHER") // Teacher endpoints
                .requestMatchers("/api/student/**").hasRole("STUDENT") // Student endpoints
                .requestMatchers("/api/parent/**").hasRole("PARENT") // Parent endpoints
                .anyRequest().authenticated()
            )
            // Solo aplicar el authenticationEntryPoint para endpoints protegidos
            .exceptionHandling(ex -> ex.authenticationEntryPoint(jwtAuthenticationEntryPoint))
            .authenticationProvider(authenticationProvider())
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
            .build();
    }
}