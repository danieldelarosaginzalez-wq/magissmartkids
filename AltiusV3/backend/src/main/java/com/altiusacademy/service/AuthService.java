package com.altiusacademy.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.altiusacademy.dto.AuthResponse;
import com.altiusacademy.dto.LoginRequest;
import com.altiusacademy.dto.RegisterRequest;
import com.altiusacademy.model.entity.Institution;
import com.altiusacademy.model.entity.ParentStudentRelation;
import com.altiusacademy.model.entity.User;
import com.altiusacademy.model.enums.UserRole;
import com.altiusacademy.repository.mysql.InstitutionRepository;
import com.altiusacademy.repository.mysql.ParentStudentRelationRepository;
import com.altiusacademy.repository.mysql.UserRepository;
import com.altiusacademy.security.JwtTokenProvider;

@Service
public class AuthService {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider tokenProvider;

    @Autowired
    private InstitutionRepository institutionRepository;

    @Autowired
    private ParentStudentRelationRepository parentStudentRelationRepository;

    /**
     * Autentica un usuario validando email y contraseña contra la base de datos MySQL
     * Genera un token JWT válido si las credenciales son correctas
     */
    public AuthResponse login(LoginRequest loginRequest) {
        try {
            System.out.println("🔐 Iniciando login para: " + loginRequest.getEmail());
            
            // Validar que el usuario existe en MySQL
            User user = userRepository.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new BadCredentialsException("Credenciales inválidas"));

            // Verificar que el usuario esté activo
            if (!user.getIsActive()) {
                throw new BadCredentialsException("Usuario inactivo");
            }

            // Autenticar con Spring Security (valida contraseña cifrada)
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                    loginRequest.getEmail(),
                    loginRequest.getPassword()
                )
            );

            // Generar token JWT válido
            String jwt = tokenProvider.generateToken(authentication);
            
            System.out.println("✅ Login exitoso para usuario ID: " + user.getId() + " con rol: " + user.getRole());
            
            // Debug: Verificar institución
            if (user.getInstitution() != null) {
                System.out.println("🏛️ Institución cargada: " + user.getInstitution().getName() + " (ID: " + user.getInstitution().getId() + ")");
            } else {
                System.out.println("⚠️ Usuario sin institución asignada");
            }

            // Debug: Verificar grado académico
            if (user.getAcademicGrade() != null) {
                System.out.println("📚 Grado académico: " + user.getAcademicGrade().getName() + " (ID: " + user.getAcademicGrade().getId() + ")");
            } else {
                System.out.println("⚠️ Usuario sin grado académico asignado (normal para profesores/coordinadores)");
            }

            AuthResponse response = new AuthResponse(jwt, user.getId(), user.getEmail(), 
                                   user.getFirstName(), user.getLastName(), user.getRole(), user.getInstitution());
            response.setAcademicGrade(user.getAcademicGrade()); // Puede ser null
            
            return response;
        } catch (BadCredentialsException e) {
            System.err.println("❌ Credenciales inválidas para: " + loginRequest.getEmail());
            throw new RuntimeException("Credenciales inválidas");
        } catch (Exception e) {
            System.err.println("❌ Error en login: " + e.getMessage());
            throw new RuntimeException("Error en el login: " + e.getMessage());
        }
    }

    /**
     * Registra un nuevo usuario en MySQL con contraseña cifrada usando BCrypt
     * Convierte automáticamente los roles del frontend al enum UserRole del backend
     */
    @Transactional
    public AuthResponse register(RegisterRequest registerRequest) {
        try {
            System.out.println("📝 Iniciando registro para: " + registerRequest.getEmail());
            
            // Verificar que el email no esté duplicado en MySQL
            if (userRepository.existsByEmail(registerRequest.getEmail())) {
                throw new RuntimeException("El correo ya está registrado");
            }

            // Crear nuevo usuario con datos validados
            User user = new User();
            user.setEmail(registerRequest.getEmail().toLowerCase().trim());
            
            // Cifrar contraseña con BCryptPasswordEncoder
            String encodedPassword = passwordEncoder.encode(registerRequest.getPassword());
            user.setPassword(encodedPassword);
            
            user.setFirstName(registerRequest.getFirstName().trim());
            user.setLastName(registerRequest.getLastName().trim());
            
            // Convertir y validar rol del frontend al enum UserRole
            UserRole userRole = convertAndValidateRole(registerRequest.getRole());
            user.setRole(userRole);
            user.setIsActive(true);
            user.setEmailVerified(false);

            // Asignar institución si se proporciona
            if (registerRequest.getInstitutionId() != null) {
                Institution institution = institutionRepository.findById(registerRequest.getInstitutionId())
                    .orElseThrow(() -> new RuntimeException("Institución no encontrada con ID: " + registerRequest.getInstitutionId()));
                user.setInstitution(institution);
                System.out.println("✅ Usuario asignado a institución: " + institution.getName());
            }

            // Manejar registro específico para coordinadores con NIT
            if (userRole == UserRole.COORDINATOR && registerRequest.getInstitutionNit() != null) {
                Institution institution = institutionRepository.findByNit(registerRequest.getInstitutionNit())
                    .orElseThrow(() -> new RuntimeException("Institución no encontrada con NIT: " + registerRequest.getInstitutionNit()));
                user.setInstitution(institution);
                System.out.println("✅ Coordinador asignado a institución por NIT: " + institution.getName());
            }

            // Guardar usuario en la base de datos MySQL
            User savedUser = userRepository.save(user);
            
            // Manejar registro específico para padres con hijos
            if (userRole == UserRole.PARENT && registerRequest.getChildrenEmails() != null && !registerRequest.getChildrenEmails().isEmpty()) {
                System.out.println("👨‍👩‍👧‍👦 Procesando registro de padre con " + registerRequest.getChildrenEmails().size() + " hijos");
                
                // Validar y crear relaciones padre-hijo
                try {
                    for (String childEmail : registerRequest.getChildrenEmails()) {
                        // Buscar el estudiante por email
                        User student = userRepository.findByEmail(childEmail)
                            .orElseThrow(() -> new RuntimeException("No se encontró estudiante con email: " + childEmail));
                        
                        // Verificar que sea un estudiante
                        if (student.getRole() != UserRole.STUDENT) {
                            throw new RuntimeException("El usuario con email " + childEmail + " no es un estudiante");
                        }
                        
                        // Crear relación padre-estudiante
                        if (!parentStudentRelationRepository.existsByParentAndStudent(savedUser, student)) {
                            ParentStudentRelation relation = new ParentStudentRelation();
                            relation.setParent(savedUser);
                            relation.setStudent(student);
                            relation.setRelationshipType("PARENT");
                            parentStudentRelationRepository.save(relation);
                        }
                    }
                    System.out.println("✅ Relaciones padre-hijo creadas exitosamente");
                } catch (Exception e) {
                    System.err.println("❌ Error creando relaciones padre-hijo: " + e.getMessage());
                    throw new RuntimeException("Error al establecer relaciones con los hijos: " + e.getMessage());
                }
            }
            System.out.println("✅ Usuario guardado en MySQL:");
            System.out.println("   ID: " + savedUser.getId());
            System.out.println("   Email: " + savedUser.getEmail());
            System.out.println("   Rol: " + savedUser.getRole());

            // Autenticar automáticamente después del registro exitoso
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                    registerRequest.getEmail(),
                    registerRequest.getPassword()
                )
            );

            // Generar token JWT para el usuario recién registrado
            String jwt = tokenProvider.generateToken(authentication);

            return new AuthResponse(jwt, savedUser.getId(), savedUser.getEmail(),
                                   savedUser.getFirstName(), savedUser.getLastName(), savedUser.getRole(), savedUser.getInstitution());
        } catch (Exception e) {
            System.err.println("❌ Error en registro: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException(e.getMessage());
        }
    }

    /**
     * Convierte y valida los roles del frontend a los valores del enum UserRole
     * Soporta tanto valores en español como en inglés del frontend
     */
    private UserRole convertAndValidateRole(String frontendRole) {
        if (frontendRole == null || frontendRole.trim().isEmpty()) {
            throw new RuntimeException("El rol es requerido");
        }
        
        String role = frontendRole.toUpperCase().trim();
        
        // Mapeo de roles del frontend (español e inglés) al enum UserRole
        switch (role) {
            // Roles en español (del frontend)
            case "ESTUDIANTE":
            case "STUDENT":
                return UserRole.STUDENT;
            case "PROFESOR":
            case "TEACHER":
                return UserRole.TEACHER;
            case "COORDINADOR":
            case "COORDINATOR":
                return UserRole.COORDINATOR;
            case "PADRE":
            case "PARENT":
                return UserRole.PARENT;
            case "SECRETARIA":
            case "SECRETARY":
                return UserRole.SECRETARY;
            case "ADMIN":
            case "ADMINISTRADOR":
                return UserRole.ADMIN;
            default:
                System.err.println("❌ Rol no válido recibido: " + frontendRole);
                throw new RuntimeException("Rol no válido: " + frontendRole + ". Roles válidos: STUDENT, TEACHER, COORDINATOR, PARENT, SECRETARY, ADMIN");
        }
    }
}