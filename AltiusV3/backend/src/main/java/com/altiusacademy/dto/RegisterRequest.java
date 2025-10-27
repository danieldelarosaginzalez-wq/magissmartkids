package com.altiusacademy.dto;

import java.util.List;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class RegisterRequest {
    
    @NotBlank(message = "Email es requerido")
    @Email(message = "Email debe ser válido")
    private String email;
    
    @NotBlank(message = "Password es requerido")
    @Size(min = 6, message = "Password debe tener al menos 6 caracteres")
    private String password;
    
    @NotBlank(message = "Nombre es requerido")
    private String firstName;
    
    @NotBlank(message = "Apellido es requerido")
    private String lastName;
    
    @NotBlank(message = "Rol es requerido")
    private String role; // STUDENT, TEACHER, COORDINATOR, PARENT
    
    private Long institutionId; // ID de la institución (opcional)
    
    // Campos específicos por rol
    private String schoolGrade; // Para estudiantes: "1° A", "2° B", etc.
    private List<String> teachingGrades; // Para profesores: múltiples grados
    private String institutionNit; // Para coordinadores: NIT de la institución
    private List<ChildInfo> children; // Para padres: información de hijos (DEPRECATED)
    private List<String> childrenEmails; // Para padres: correos de hijos (NUEVO FLUJO)
    
    // Clase interna para información de hijos (DEPRECATED - mantener por compatibilidad)
    public static class ChildInfo {
        private String institutionNit;
        private String childEmail;
        
        public ChildInfo() {}
        
        public ChildInfo(String institutionNit, String childEmail) {
            this.institutionNit = institutionNit;
            this.childEmail = childEmail;
        }
        
        public String getInstitutionNit() { return institutionNit; }
        public void setInstitutionNit(String institutionNit) { this.institutionNit = institutionNit; }
        
        public String getChildEmail() { return childEmail; }
        public void setChildEmail(String childEmail) { this.childEmail = childEmail; }
    }

    // Constructors
    public RegisterRequest() {}

    public RegisterRequest(String email, String password, String firstName, String lastName, String role) {
        this.email = email;
        this.password = password;
        this.firstName = firstName;
        this.lastName = lastName;
        this.role = role;
    }

    public RegisterRequest(String email, String password, String firstName, String lastName, String role, Long institutionId) {
        this.email = email;
        this.password = password;
        this.firstName = firstName;
        this.lastName = lastName;
        this.role = role;
        this.institutionId = institutionId;
    }

    // Getters and Setters
    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public Long getInstitutionId() {
        return institutionId;
    }

    public void setInstitutionId(Long institutionId) {
        this.institutionId = institutionId;
    }
    
    public String getSchoolGrade() {
        return schoolGrade;
    }

    public void setSchoolGrade(String schoolGrade) {
        this.schoolGrade = schoolGrade;
    }

    public List<String> getTeachingGrades() {
        return teachingGrades;
    }

    public void setTeachingGrades(List<String> teachingGrades) {
        this.teachingGrades = teachingGrades;
    }

    public String getInstitutionNit() {
        return institutionNit;
    }

    public void setInstitutionNit(String institutionNit) {
        this.institutionNit = institutionNit;
    }

    public List<ChildInfo> getChildren() {
        return children;
    }

    public void setChildren(List<ChildInfo> children) {
        this.children = children;
    }

    public List<String> getChildrenEmails() {
        return childrenEmails;
    }

    public void setChildrenEmails(List<String> childrenEmails) {
        this.childrenEmails = childrenEmails;
    }
}