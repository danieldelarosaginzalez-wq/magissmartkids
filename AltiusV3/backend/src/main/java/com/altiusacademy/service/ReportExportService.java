package com.altiusacademy.service;

import com.altiusacademy.dto.*;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class ReportExportService {

    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");

    public byte[] exportSubjectPerformanceToExcel(SubjectPerformanceReportDto report) throws IOException {
        try (XSSFWorkbook workbook = new XSSFWorkbook()) {
            // Create main sheet
            Sheet sheet = workbook.createSheet("Rendimiento por Materia");

            // Create header style
            CellStyle headerStyle = createHeaderStyle(workbook);
            CellStyle dataStyle = createDataStyle(workbook);

            int rowNum = 0;

            // Title
            Row titleRow = sheet.createRow(rowNum++);
            Cell titleCell = titleRow.createCell(0);
            titleCell.setCellValue("REPORTE DE RENDIMIENTO POR MATERIA");
            titleCell.setCellStyle(headerStyle);

            // Empty row
            rowNum++;

            // Basic information
            createInfoRow(sheet, rowNum++, "Materia:", report.getSubjectName(), headerStyle, dataStyle);
            createInfoRow(sheet, rowNum++, "Grado:", report.getGradeName(), headerStyle, dataStyle);
            createInfoRow(sheet, rowNum++, "Profesor:", report.getTeacherName(), headerStyle, dataStyle);
            createInfoRow(sheet, rowNum++, "Fecha de generación:", LocalDateTime.now().format(DATE_FORMATTER),
                    headerStyle, dataStyle);

            // Empty row
            rowNum++;

            // Statistics
            Row statsHeaderRow = sheet.createRow(rowNum++);
            statsHeaderRow.createCell(0).setCellValue("ESTADÍSTICAS GENERALES");
            statsHeaderRow.getCell(0).setCellStyle(headerStyle);

            createInfoRow(sheet, rowNum++, "Total de estudiantes:", String.valueOf(report.getTotalStudents()),
                    headerStyle, dataStyle);
            createInfoRow(sheet, rowNum++, "Estudiantes activos:", String.valueOf(report.getActiveStudents()),
                    headerStyle, dataStyle);
            createInfoRow(sheet, rowNum++, "Total de tareas:", String.valueOf(report.getTotalTasks()), headerStyle,
                    dataStyle);
            createInfoRow(sheet, rowNum++, "Tareas completadas:", String.valueOf(report.getCompletedTasks()),
                    headerStyle, dataStyle);
            createInfoRow(sheet, rowNum++, "Promedio general:", String.format("%.2f", report.getAverageGrade()),
                    headerStyle, dataStyle);
            createInfoRow(sheet, rowNum++, "Tasa de completado:", String.format("%.1f%%", report.getCompletionRate()),
                    headerStyle, dataStyle);

            // Empty row
            rowNum++;

            // Student performance details
            if (report.getStudentPerformances() != null && !report.getStudentPerformances().isEmpty()) {
                Row studentHeaderRow = sheet.createRow(rowNum++);
                studentHeaderRow.createCell(0).setCellValue("RENDIMIENTO POR ESTUDIANTE");
                studentHeaderRow.getCell(0).setCellStyle(headerStyle);

                // Student table headers
                Row studentTableHeader = sheet.createRow(rowNum++);
                String[] studentHeaders = { "Estudiante", "Email", "Tareas Completadas", "Total Tareas", "Promedio",
                        "% Completado" };
                for (int i = 0; i < studentHeaders.length; i++) {
                    Cell cell = studentTableHeader.createCell(i);
                    cell.setCellValue(studentHeaders[i]);
                    cell.setCellStyle(headerStyle);
                }

                // Student data
                for (SubjectPerformanceReportDto.StudentPerformanceDto student : report.getStudentPerformances()) {
                    Row studentRow = sheet.createRow(rowNum++);
                    studentRow.createCell(0).setCellValue(student.getStudentName());
                    studentRow.createCell(1).setCellValue(student.getStudentEmail());
                    studentRow.createCell(2).setCellValue(student.getCompletedTasks());
                    studentRow.createCell(3).setCellValue(student.getTotalTasks());
                    studentRow.createCell(4).setCellValue(student.getAverageGrade());
                    studentRow.createCell(5).setCellValue(student.getCompletionRate());

                    for (int i = 0; i < 6; i++) {
                        studentRow.getCell(i).setCellStyle(dataStyle);
                    }
                }
            }

            // Auto-size columns
            for (int i = 0; i < 6; i++) {
                sheet.autoSizeColumn(i);
            }

            // Convert to byte array
            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            workbook.write(outputStream);
            return outputStream.toByteArray();
        }
    }

    public byte[] exportTeacherActivityToExcel(List<TeacherActivityReportDto> reports) throws IOException {
        try (XSSFWorkbook workbook = new XSSFWorkbook()) {
            Sheet sheet = workbook.createSheet("Actividad de Profesores");

            CellStyle headerStyle = createHeaderStyle(workbook);
            CellStyle dataStyle = createDataStyle(workbook);

            int rowNum = 0;

            // Title
            Row titleRow = sheet.createRow(rowNum++);
            Cell titleCell = titleRow.createCell(0);
            titleCell.setCellValue("REPORTE DE ACTIVIDAD DE PROFESORES");
            titleCell.setCellStyle(headerStyle);

            // Empty row
            rowNum++;

            // Generation date
            createInfoRow(sheet, rowNum++, "Fecha de generación:", LocalDateTime.now().format(DATE_FORMATTER),
                    headerStyle, dataStyle);

            // Empty row
            rowNum++;

            // Table headers
            Row tableHeader = sheet.createRow(rowNum++);
            String[] headers = { "Profesor", "Email", "Materias", "Grados", "Total Tareas", "Total Actividades",
                    "Total Estudiantes", "Promedio Calificaciones", "Última Actividad" };
            for (int i = 0; i < headers.length; i++) {
                Cell cell = tableHeader.createCell(i);
                cell.setCellValue(headers[i]);
                cell.setCellStyle(headerStyle);
            }

            // Data rows
            for (TeacherActivityReportDto teacher : reports) {
                Row teacherRow = sheet.createRow(rowNum++);
                teacherRow.createCell(0).setCellValue(teacher.getTeacherName());
                teacherRow.createCell(1).setCellValue(teacher.getTeacherEmail());
                teacherRow.createCell(2)
                        .setCellValue(teacher.getSubjects() != null ? String.join(", ", teacher.getSubjects()) : "");
                teacherRow.createCell(3)
                        .setCellValue(teacher.getGrades() != null ? String.join(", ", teacher.getGrades()) : "");
                teacherRow.createCell(4).setCellValue(teacher.getTotalTasks() != null ? teacher.getTotalTasks() : 0);
                teacherRow.createCell(5)
                        .setCellValue(teacher.getTotalActivities() != null ? teacher.getTotalActivities() : 0);
                teacherRow.createCell(6)
                        .setCellValue(teacher.getTotalStudents() != null ? teacher.getTotalStudents() : 0);
                teacherRow.createCell(7)
                        .setCellValue(teacher.getAverageGradeGiven() != null ? teacher.getAverageGradeGiven() : 0.0);
                teacherRow.createCell(8).setCellValue(
                        teacher.getLastActivity() != null ? teacher.getLastActivity().format(DATE_FORMATTER) : "N/A");

                for (int i = 0; i < 9; i++) {
                    teacherRow.getCell(i).setCellStyle(dataStyle);
                }
            }

            // Auto-size columns
            for (int i = 0; i < 9; i++) {
                sheet.autoSizeColumn(i);
            }

            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            workbook.write(outputStream);
            return outputStream.toByteArray();
        }
    }

    public byte[] exportStudentParticipationToExcel(List<StudentParticipationReportDto> reports) throws IOException {
        try (XSSFWorkbook workbook = new XSSFWorkbook()) {
            Sheet sheet = workbook.createSheet("Participación Estudiantil");

            CellStyle headerStyle = createHeaderStyle(workbook);
            CellStyle dataStyle = createDataStyle(workbook);

            int rowNum = 0;

            // Title
            Row titleRow = sheet.createRow(rowNum++);
            Cell titleCell = titleRow.createCell(0);
            titleCell.setCellValue("REPORTE DE PARTICIPACIÓN ESTUDIANTIL");
            titleCell.setCellStyle(headerStyle);

            // Empty row
            rowNum++;

            // Generation date
            createInfoRow(sheet, rowNum++, "Fecha de generación:", LocalDateTime.now().format(DATE_FORMATTER),
                    headerStyle, dataStyle);

            // Empty row
            rowNum++;

            for (StudentParticipationReportDto report : reports) {
                // Section header
                Row sectionHeader = sheet.createRow(rowNum++);
                sectionHeader.createCell(0)
                        .setCellValue("MATERIA: " + report.getSubjectName() + " - GRADO: " + report.getGradeName());
                sectionHeader.getCell(0).setCellStyle(headerStyle);

                // Statistics
                createInfoRow(sheet, rowNum++, "Total estudiantes:", String.valueOf(report.getTotalStudents()),
                        headerStyle, dataStyle);
                createInfoRow(sheet, rowNum++, "Estudiantes activos:", String.valueOf(report.getActiveStudents()),
                        headerStyle, dataStyle);
                createInfoRow(sheet, rowNum++, "Tasa de participación:",
                        String.format("%.1f%%", report.getParticipationRate()), headerStyle, dataStyle);
                createInfoRow(sheet, rowNum++, "Promedio general:", String.format("%.2f", report.getAverageGrade()),
                        headerStyle, dataStyle);

                // Empty row
                rowNum++;

                // Student details
                if (report.getStudentParticipations() != null && !report.getStudentParticipations().isEmpty()) {
                    Row detailHeader = sheet.createRow(rowNum++);
                    String[] detailHeaders = { "Estudiante", "Email", "Tareas Completadas", "Actividades Completadas",
                            "Promedio", "% Participación", "Última Actividad" };
                    for (int i = 0; i < detailHeaders.length; i++) {
                        Cell cell = detailHeader.createCell(i);
                        cell.setCellValue(detailHeaders[i]);
                        cell.setCellStyle(headerStyle);
                    }

                    for (StudentParticipationReportDto.StudentParticipationDto student : report
                            .getStudentParticipations()) {
                        Row studentRow = sheet.createRow(rowNum++);
                        studentRow.createCell(0).setCellValue(student.getStudentName());
                        studentRow.createCell(1).setCellValue(student.getStudentEmail());
                        studentRow.createCell(2)
                                .setCellValue(student.getCompletedTasks() != null ? student.getCompletedTasks() : 0);
                        studentRow.createCell(3).setCellValue(
                                student.getCompletedActivities() != null ? student.getCompletedActivities() : 0);
                        studentRow.createCell(4)
                                .setCellValue(student.getAverageGrade() != null ? student.getAverageGrade() : 0.0);
                        studentRow.createCell(5).setCellValue(
                                student.getParticipationRate() != null ? student.getParticipationRate() : 0.0);
                        studentRow.createCell(6)
                                .setCellValue(student.getLastActivity() != null
                                        ? student.getLastActivity().format(DATE_FORMATTER)
                                        : "N/A");

                        for (int i = 0; i < 7; i++) {
                            studentRow.getCell(i).setCellStyle(dataStyle);
                        }
                    }
                }

                // Empty rows between sections
                rowNum += 2;
            }

            // Auto-size columns
            for (int i = 0; i < 7; i++) {
                sheet.autoSizeColumn(i);
            }

            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            workbook.write(outputStream);
            return outputStream.toByteArray();
        }
    }

    private CellStyle createHeaderStyle(Workbook workbook) {
        CellStyle style = workbook.createCellStyle();
        Font font = workbook.createFont();
        font.setBold(true);
        font.setFontHeightInPoints((short) 12);
        style.setFont(font);
        style.setFillForegroundColor(IndexedColors.GREY_25_PERCENT.getIndex());
        style.setFillPattern(FillPatternType.SOLID_FOREGROUND);
        style.setBorderBottom(BorderStyle.THIN);
        style.setBorderTop(BorderStyle.THIN);
        style.setBorderRight(BorderStyle.THIN);
        style.setBorderLeft(BorderStyle.THIN);
        style.setAlignment(HorizontalAlignment.CENTER);
        return style;
    }

    private CellStyle createDataStyle(Workbook workbook) {
        CellStyle style = workbook.createCellStyle();
        style.setBorderBottom(BorderStyle.THIN);
        style.setBorderTop(BorderStyle.THIN);
        style.setBorderRight(BorderStyle.THIN);
        style.setBorderLeft(BorderStyle.THIN);
        style.setAlignment(HorizontalAlignment.LEFT);
        return style;
    }

    private void createInfoRow(Sheet sheet, int rowNum, String label, String value, CellStyle headerStyle,
            CellStyle dataStyle) {
        Row row = sheet.createRow(rowNum);
        Cell labelCell = row.createCell(0);
        labelCell.setCellValue(label);
        labelCell.setCellStyle(headerStyle);

        Cell valueCell = row.createCell(1);
        valueCell.setCellValue(value);
        valueCell.setCellStyle(dataStyle);
    }
}