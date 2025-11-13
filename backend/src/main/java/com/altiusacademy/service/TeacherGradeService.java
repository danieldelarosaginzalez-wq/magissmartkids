package com.altiusacademy.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.altiusacademy.dto.AssignTeacherGradeRequest;
import com.altiusacademy.dto.TeacherGradeDto;
import com.altiusacademy.model.entity.Institution;
import com.altiusacademy.model.entity.TeacherGrade;
import com.altiusacademy.model.entity.User;
import com.altiusacademy.repository.mysql.InstitutionRepository;
import com.altiusacademy.repository.mysql.TeacherGradeRepository;
import com.altiusacademy.repository.mysql.UserRepository;

@Service
public class TeacherGradeService {

    private final TeacherGradeRepository teacherGradeRepository;
    private final UserRepository userRepository;
    private final InstitutionRepository institutionRepository;

    public TeacherGradeService(TeacherGradeRepository teacherGradeRepository,
                              UserRepository userRepository,
                              InstitutionRepository institutionRepository) {
        this.teacherGradeRepository = teacherGradeRepository;
        this.userRepository = userRepository;
        this.institutionRepository = institutionRepository;
    }

    @Transactional
    public TeacherGradeDto assignTeacherToGrade(AssignTeacherGradeRequest request) {
        // Validar que el profesor existe
        User teacher = userRepository.findById(request.getTeacherId())
            .orElseThrow(() -> new RuntimeException("Profesor no encontrado"));

        // Validar que la institución existe
        Institution institution = institutionRepository.findById(request.getInstitutionId())
            .orElseThrow(() -> new RuntimeException("Institución no encontrada"));

        // Verificar si ya existe esta asignación
        boolean exists = teacherGradeRepository.existsByTeacherIdAndGradeLevelAndSectionAndIsActiveTrue(
            request.getTeacherId(), request.getGradeLevel(), request.getSection());

        if (exists) {
            throw new RuntimeException("El profesor ya tiene asignado este grado y sección");
        }

        // Crear la nueva asignación
        TeacherGrade teacherGrade = new TeacherGrade();
        teacherGrade.setTeacher(teacher);
        teacherGrade.setGradeLevel(request.getGradeLevel());
        teacherGrade.setSection(request.getSection());
        teacherGrade.setInstitution(institution);
        teacherGrade.setAcademicYear(request.getAcademicYear());
        teacherGrade.setIsActive(true);

        teacherGrade = teacherGradeRepository.save(teacherGrade);

        return convertToDto(teacherGrade);
    }

    @Transactional(readOnly = true)
    public List<TeacherGradeDto> getTeacherGrades(Long teacherId) {
        List<TeacherGrade> grades = teacherGradeRepository.findByTeacherIdAndIsActiveTrue(teacherId);
        return grades.stream()
            .map(this::convertToDto)
            .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<TeacherGradeDto> getGradesByInstitution(Long institutionId) {
        List<TeacherGrade> grades = teacherGradeRepository.findAllByInstitutionWithTeacher(institutionId);
        return grades.stream()
            .map(this::convertToDto)
            .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<TeacherGradeDto> getGradesByLevel(Integer gradeLevel, Long institutionId) {
        List<TeacherGrade> grades = teacherGradeRepository
            .findByGradeLevelAndInstitutionIdAndIsActiveTrue(gradeLevel, institutionId);
        return grades.stream()
            .map(this::convertToDto)
            .collect(Collectors.toList());
    }

    @Transactional
    public void removeTeacherFromGrade(Long teacherGradeId) {
        TeacherGrade teacherGrade = teacherGradeRepository.findById(teacherGradeId)
            .orElseThrow(() -> new RuntimeException("Asignación no encontrada"));
        
        teacherGrade.setIsActive(false);
        teacherGradeRepository.save(teacherGrade);
    }

    @Transactional
    public TeacherGradeDto updateTeacherGrade(Long teacherGradeId, AssignTeacherGradeRequest request) {
        TeacherGrade teacherGrade = teacherGradeRepository.findById(teacherGradeId)
            .orElseThrow(() -> new RuntimeException("Asignación no encontrada"));

        // Actualizar campos
        if (request.getGradeLevel() != null) {
            teacherGrade.setGradeLevel(request.getGradeLevel());
        }
        if (request.getSection() != null) {
            teacherGrade.setSection(request.getSection());
        }
        if (request.getAcademicYear() != null) {
            teacherGrade.setAcademicYear(request.getAcademicYear());
        }

        teacherGrade = teacherGradeRepository.save(teacherGrade);
        return convertToDto(teacherGrade);
    }

    private TeacherGradeDto convertToDto(TeacherGrade teacherGrade) {
        TeacherGradeDto dto = new TeacherGradeDto();
        dto.setId(teacherGrade.getId());
        dto.setTeacherId(teacherGrade.getTeacher().getId());
        dto.setTeacherName(teacherGrade.getTeacher().getFullName());
        dto.setGradeLevel(teacherGrade.getGradeLevel());
        dto.setSection(teacherGrade.getSection());
        dto.setFullGradeName(teacherGrade.getFullGradeName());
        dto.setInstitutionId(teacherGrade.getInstitution().getId());
        dto.setInstitutionName(teacherGrade.getInstitution().getName());
        dto.setIsActive(teacherGrade.getIsActive());
        dto.setAcademicYear(teacherGrade.getAcademicYear());
        return dto;
    }
}
