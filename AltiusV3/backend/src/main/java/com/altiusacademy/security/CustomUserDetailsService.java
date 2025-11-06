package com.altiusacademy.security;

import com.altiusacademy.model.entity.User;
import com.altiusacademy.repository.mysql.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

/**
 * Servicio personalizado de detalles de usuario para Spring Security
 * 
 * Carga usuarios desde MySQL y los convierte a UserDetails para Spring Security.
 * Maneja la autorización basada en roles (STUDENT, TEACHER, COORDINATOR, SUPER_ADMIN).
 */
@Service
@Transactional(readOnly = true)
public class CustomUserDetailsService implements UserDetailsService {

    private static final Logger logger = LoggerFactory.getLogger(CustomUserDetailsService.class);
    private static final String ROLE_PREFIX = "ROLE_";

    @Autowired
    private UserRepository userRepository;

    /**
     * Carga un usuario por su email para Spring Security
     * 
     * @param email Email del usuario
     * @return UserDetails con información del usuario y sus roles
     * @throws UsernameNotFoundException si el usuario no existe o está inactivo
     */
    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        logger.debug("Cargando usuario: {}", email);

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado: " + email));

        // Verificar que el usuario esté activo
        if (!user.getIsActive()) {
            throw new UsernameNotFoundException("Usuario inactivo: " + email);
        }

        // Verificar que tenga rol
        if (user.getRole() == null) {
            throw new UsernameNotFoundException("Usuario sin rol: " + email);
        }

        logger.debug("Usuario cargado: {} - Rol: {}", email, user.getRole());

        return createUserDetails(user);
    }

    /**
     * Convierte una entidad User a UserDetails de Spring Security
     */
    private UserDetails createUserDetails(User user) {
        Collection<GrantedAuthority> authorities = buildUserAuthorities(user);

        return org.springframework.security.core.userdetails.User.builder()
                .username(user.getEmail())
                .password(user.getPassword())
                .authorities(authorities)
                .disabled(!user.getIsActive())
                .accountExpired(false)
                .accountLocked(false)
                .credentialsExpired(false)
                .build();
    }

    /**
     * Construye las autoridades (roles) para un usuario
     */
    private Collection<GrantedAuthority> buildUserAuthorities(User user) {
        List<GrantedAuthority> authorities = new ArrayList<>();

        if (user.getRole() != null) {
            String roleName = ROLE_PREFIX + user.getRole().name();
            authorities.add(new SimpleGrantedAuthority(roleName));
        }

        return authorities;
    }
}