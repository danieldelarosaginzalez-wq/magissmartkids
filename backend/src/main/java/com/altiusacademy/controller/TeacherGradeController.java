package com.altiusacademy.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.altiusacademy.dto.AssignTeacherGradeRequest;
import com.altiusacademy.dto.TeacherGradeDto;
import com.altiusacademy.service.TeacherGradeService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/teacher-grades")
@Tag(name = "Teacher Grades", description = "Gestión de asignación de profesores a grados")
public class TeacherGradeController {

    private final TeacherGradeService teacherGradeService;

    public TeacherGradeController(TeacherGradeService teacherGradeService) {
        this.teacherGradeService = teacherGradeService;
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'COORDINATOR')")
    @Operation(summary = "Asignar un profesor a un grado específico")
    public ResponseEntity<TeacherGradeDto> assignTeacherToGrade(
            @Valid @RequestBody AssignTeacherGradeRequest request) {
        try {
            TeacherGradeDto result = teacherGradeService.assignTeacherToGrade(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(result);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/teacher/{teacherId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'COORDINATOR', 'TEACHER')")
    @Operation(summary = "Obtener todos los grados asignados a un profesor")
    public ResponseEntity<List<TeacherGradeDto>> getTeacherGrades(@PathVariable Long teacherId) {
        List<TeacherGradeDto> grades = teacherGradeService.getTeacherGrades(teacherId);
        return ResponseEntity.ok(grades);
    }

    @GetMapping("/institution/{institutionId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'COORDINATOR')")
    @Operation(summary = "Obtener todos los grados de una institución")
    public ResponseEntity<List<TeacherGradeDto>> getGradesByInstitution(@PathVariable Long institutionId) {
        List<TeacherGradeDto> grades = teacherGradeService.getGradesByInstitution(institutionId);
        return ResponseEntity.ok(grades);
    }

    @GetMapping("/level")
    @PreAuthorize("hasAnyRole('ADMIN', 'COORDINATOR')")
    @Operation(summary = "Obtener todos los grados de un nivel específico")
    public ResponseEntity<List<TeacherGradeDto>> getGradesByLevel(
            @RequestParam Integer gradeLevel,
            @RequestParam Long institutionId) {
        List<TeacherGradeDto> grades = teacherGradeService.getGradesByLevel(gradeLevel, institutionId);
        return ResponseEntity.ok(grades);
    }

    @PutMapping("/{teacherGradeId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'COORDINATOR')")
    @Operation(summary = "Actualizar una asignación de profesor a grado")
    public ResponseEntity<TeacherGradeDto> updateTeacherGrade(
            @PathVariable Long teacherGradeId,
            @Valid @RequestBody AssignTeacherGradeRequest request) {
        try {
            TeacherGradeDto result = teacherGradeService.updateTeacherGrade(teacherGradeId, request);
            return ResponseEntity.ok(result);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{teacherGradeId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'COORDINATOR')")
    @Operation(summary = "Remover un profesor de un grado")
    public ResponseEntity<Void> removeTeacherFromGrade(@PathVariable Long teacherGradeId) {
        try {
            teacherGradeService.removeTeacherFromGrade(teacherGradeId);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
