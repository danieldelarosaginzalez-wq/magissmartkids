package com.altiusacademy.service;

import com.altiusacademy.model.entity.Task;
import com.altiusacademy.model.entity.TaskSubmission;
import com.altiusacademy.model.entity.User;
import com.altiusacademy.repository.mysql.TaskRepository;
import com.altiusacademy.repository.mysql.TaskSubmissionRepository;
import com.altiusacademy.repository.mysql.UserRepository;
import org.springframework.stereotype.Service;
import weka.classifiers.trees.J48;
import weka.core.Attribute;
import weka.core.DenseInstance;
import weka.core.Instances;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class PredictionService {
    
    private final TaskSubmissionRepository taskSubmissionRepository;
    private final UserRepository userRepository;
    private final TaskRepository taskRepository;
    
    public PredictionService(TaskSubmissionRepository taskSubmissionRepository, 
                           UserRepository userRepository,
                           TaskRepository taskRepository) {
        this.taskSubmissionRepository = taskSubmissionRepository;
        this.userRepository = userRepository;
        this.taskRepository = taskRepository;
    }
    
    public Map<String, Object> predictStudentPerformance(String grade) {
        try {
            // 1. Obtener datos de estudiantes del grado (IGUAL QUE EN CALIFICACIONES)
            List<User> students = userRepository.findStudentsByGrade(grade);
            
            // 2. Crear dataset de WEKA
            ArrayList<Attribute> attributes = new ArrayList<>();
            attributes.add(new Attribute("promedio_notas"));
            attributes.add(new Attribute("tareas_calificadas"));
            attributes.add(new Attribute("tareas_sin_calificar"));
            attributes.add(new Attribute("tareas_sin_entregar"));
            attributes.add(new Attribute("porcentaje_entrega"));
            
            ArrayList<String> classValues = new ArrayList<>();
            classValues.add("APROBADO");
            classValues.add("EN_RIESGO");
            classValues.add("REPROBADO");
            attributes.add(new Attribute("resultado", classValues));
            
            Instances dataset = new Instances("StudentPerformance", attributes, 0);
            dataset.setClassIndex(dataset.numAttributes() - 1);
            
            // 3. Llenar dataset con datos reales (MISMA LÓGICA QUE getStudentGradesForGrade)
            Map<Long, Map<String, Object>> studentData = new HashMap<>();
            
            for (User student : students) {
                // Obtener todas las entregas del estudiante
                List<TaskSubmission> submissions = taskSubmissionRepository.findByStudentId(student.getId());
                
                // Obtener tareas disponibles para el estudiante
                List<Task> specificTasks = taskRepository.findByStudentId(student.getId());
                List<Task> gradeTasks = taskRepository.findByGradeOrderByCreatedAtDesc(grade).stream()
                    .filter(t -> t.getStudent() == null)
                    .collect(Collectors.toList());
                
                // Total de tareas disponibles = específicas + generales del grado
                int totalTasks = specificTasks.size() + gradeTasks.size();
                
                // Calcular estadísticas de entregas
                int completedTasks = (int) submissions.stream()
                    .filter(s -> s.getScore() != null)
                    .count();
                int pendingTasks = Math.max(0, totalTasks - submissions.size());
                
                // Calcular promedio: suma de notas / total de tareas asignadas
                // Las tareas no entregadas cuentan como 0
                double totalScore = submissions.stream()
                    .filter(s -> s.getScore() != null)
                    .mapToDouble(TaskSubmission::getScore)
                    .sum();
                
                double averageGrade = totalTasks > 0 ? totalScore / totalTasks : 0.0;
                
                // Tareas sin calificar
                long tareasSinCalificar = submissions.stream()
                    .filter(s -> s.getStatus() == TaskSubmission.SubmissionStatus.SUBMITTED)
                    .count();
                
                // Porcentaje de entrega
                double porcentajeEntrega = totalTasks > 0 
                    ? (submissions.size() * 100.0) / totalTasks 
                    : 0.0;
                
                // Clasificar resultado basado en promedio real
                String resultado;
                if (averageGrade >= 3.5 && porcentajeEntrega >= 70) {
                    resultado = "APROBADO";
                } else if (averageGrade >= 3.0 && porcentajeEntrega >= 50) {
                    resultado = "EN_RIESGO";
                } else {
                    resultado = "REPROBADO";
                }
                
                // Si tiene muchas tareas sin entregar, aumentar riesgo
                if (pendingTasks > 3) {
                    if ("APROBADO".equals(resultado)) {
                        resultado = "EN_RIESGO";
                    } else if ("EN_RIESGO".equals(resultado)) {
                        resultado = "REPROBADO";
                    }
                }
                
                // Crear instancia para WEKA
                double[] values = new double[]{
                    averageGrade,
                    completedTasks,
                    tareasSinCalificar,
                    pendingTasks,
                    porcentajeEntrega,
                    classValues.indexOf(resultado)
                };
                
                dataset.add(new DenseInstance(1.0, values));
                
                // Guardar datos para respuesta
                Map<String, Object> data = new HashMap<>();
                data.put("nombre", student.getFullName());
                data.put("promedioNotas", Math.round(averageGrade * 10.0) / 10.0);
                data.put("tareasCalificadas", completedTasks);
                data.put("tareasSinCalificar", tareasSinCalificar);
                data.put("tareasSinEntregar", (long) pendingTasks);
                data.put("porcentajeEntrega", Math.round(porcentajeEntrega * 10.0) / 10.0);
                data.put("resultado", resultado);
                studentData.put(student.getId(), data);
            }
            
            // 4. Entrenar modelo J48 (árbol de decisión)
            J48 tree = new J48();
            if (dataset.numInstances() > 0) {
                tree.buildClassifier(dataset);
            }
            
            // 5. Generar predicciones y recomendaciones
            List<Map<String, Object>> predictions = new ArrayList<>();
            
            for (Map.Entry<Long, Map<String, Object>> entry : studentData.entrySet()) {
                Long studentId = entry.getKey();
                Map<String, Object> data = entry.getValue();
                String resultado = (String) data.get("resultado");
                
                Map<String, Object> prediction = new HashMap<>(data);
                prediction.put("studentId", studentId);
                
                // Agregar recomendaciones específicas
                double promedioNotas = (Double) data.get("promedioNotas");
                long tareasSinEntregar = (Long) data.get("tareasSinEntregar");
                long tareasSinCalificar = (Long) data.get("tareasSinCalificar");
                
                if ("REPROBADO".equals(resultado)) {
                    prediction.put("riesgo", "ALTO");
                    String recomendacion = "⚠️ ATENCIÓN URGENTE: ";
                    if (promedioNotas < 3.0) {
                        recomendacion += "Promedio bajo (" + promedioNotas + "). ";
                    }
                    if (tareasSinEntregar > 3) {
                        recomendacion += tareasSinEntregar + " tareas sin entregar. ";
                    }
                    recomendacion += "Requiere tutorías inmediatas y plan de recuperación.";
                    prediction.put("recomendacion", recomendacion);
                    
                } else if ("EN_RIESGO".equals(resultado)) {
                    prediction.put("riesgo", "MEDIO");
                    String recomendacion = "⚡ Estudiante en riesgo: ";
                    if (promedioNotas < 3.5) {
                        recomendacion += "Mejorar promedio (actual: " + promedioNotas + "). ";
                    }
                    if (tareasSinEntregar > 0) {
                        recomendacion += "Ponerse al día con " + tareasSinEntregar + " tareas pendientes. ";
                    }
                    if (tareasSinCalificar > 0) {
                        recomendacion += tareasSinCalificar + " tareas esperan calificación. ";
                    }
                    recomendacion += "Monitoreo semanal recomendado.";
                    prediction.put("recomendacion", recomendacion);
                    
                } else {
                    prediction.put("riesgo", "BAJO");
                    String recomendacion = "✅ Buen desempeño (promedio: " + promedioNotas + "). ";
                    if (tareasSinEntregar > 0) {
                        recomendacion += "Completar " + tareasSinEntregar + " tareas pendientes para mantener el ritmo.";
                    } else {
                        recomendacion += "Continuar con el excelente trabajo.";
                    }
                    prediction.put("recomendacion", recomendacion);
                }
                
                predictions.add(prediction);
            }
            
            // Ordenar por riesgo (ALTO -> MEDIO -> BAJO)
            predictions.sort((p1, p2) -> {
                String r1 = (String) p1.get("riesgo");
                String r2 = (String) p2.get("riesgo");
                Map<String, Integer> orden = Map.of("ALTO", 0, "MEDIO", 1, "BAJO", 2);
                return orden.get(r1).compareTo(orden.get(r2));
            });
            
            // 6. Preparar respuesta
            Map<String, Object> response = new HashMap<>();
            response.put("grado", grade);
            response.put("totalEstudiantes", predictions.size());
            response.put("predicciones", predictions);
            response.put("modelo", dataset.numInstances() > 0 ? tree.toString() : "No hay datos suficientes");
            response.put("estadisticas", Map.of(
                "aprobados", predictions.stream().filter(p -> "APROBADO".equals(p.get("resultado"))).count(),
                "enRiesgo", predictions.stream().filter(p -> "EN_RIESGO".equals(p.get("resultado"))).count(),
                "reprobados", predictions.stream().filter(p -> "REPROBADO".equals(p.get("resultado"))).count()
            ));
            
            return response;
            
        } catch (Exception e) {
            throw new RuntimeException("Error al generar predicciones: " + e.getMessage(), e);
        }
    }
}
