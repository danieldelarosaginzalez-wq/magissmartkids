package com.altiusacademy.service;

import com.altiusacademy.model.entity.TaskSubmission;
import com.altiusacademy.model.entity.User;
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
    
    public PredictionService(TaskSubmissionRepository taskSubmissionRepository, 
                           UserRepository userRepository) {
        this.taskSubmissionRepository = taskSubmissionRepository;
        this.userRepository = userRepository;
    }
    
    public Map<String, Object> predictStudentPerformance(String grade) {
        try {
            // 1. Obtener datos de estudiantes del grado
            List<User> students = userRepository.findBySchoolGradeGradeName(grade);
            
            // 2. Crear dataset de WEKA
            ArrayList<Attribute> attributes = new ArrayList<>();
            attributes.add(new Attribute("promedio_general"));
            attributes.add(new Attribute("tareas_completadas"));
            attributes.add(new Attribute("tareas_pendientes"));
            attributes.add(new Attribute("promedio_matematicas"));
            attributes.add(new Attribute("promedio_ciencias"));
            
            ArrayList<String> classValues = new ArrayList<>();
            classValues.add("APROBADO");
            classValues.add("EN_RIESGO");
            classValues.add("REPROBADO");
            attributes.add(new Attribute("resultado", classValues));
            
            Instances dataset = new Instances("StudentPerformance", attributes, 0);
            dataset.setClassIndex(dataset.numAttributes() - 1);
            
            // 3. Llenar dataset con datos reales
            Map<Long, Map<String, Object>> studentData = new HashMap<>();
            
            for (User student : students) {
                List<TaskSubmission> submissions = taskSubmissionRepository
                    .findByStudentIdAndStatus(student.getId(), TaskSubmission.SubmissionStatus.GRADED);
                
                if (submissions.isEmpty()) continue;
                
                double promedioGeneral = submissions.stream()
                    .mapToDouble(TaskSubmission::getScore)
                    .average()
                    .orElse(0.0);
                
                long tareasCompletadas = submissions.size();
                
                // Calcular promedios por materia
                Map<String, Double> promediosPorMateria = submissions.stream()
                    .collect(Collectors.groupingBy(
                        s -> s.getTask().getSubject().getName(),
                        Collectors.averagingDouble(TaskSubmission::getScore)
                    ));
                
                double promedioMatematicas = promediosPorMateria.getOrDefault("Matemáticas", 0.0);
                double promedioCiencias = promediosPorMateria.getOrDefault("Ciencias Naturales", 0.0);
                
                // Clasificar resultado
                String resultado;
                if (promedioGeneral >= 4.0) {
                    resultado = "APROBADO";
                } else if (promedioGeneral >= 3.0) {
                    resultado = "EN_RIESGO";
                } else {
                    resultado = "REPROBADO";
                }
                
                // Crear instancia
                double[] values = new double[]{
                    promedioGeneral,
                    tareasCompletadas,
                    0, // tareas pendientes (simplificado)
                    promedioMatematicas,
                    promedioCiencias,
                    classValues.indexOf(resultado)
                };
                
                dataset.add(new DenseInstance(1.0, values));
                
                // Guardar datos para respuesta
                Map<String, Object> data = new HashMap<>();
                data.put("nombre", student.getFirstName() + " " + student.getLastName());
                data.put("promedioGeneral", Math.round(promedioGeneral * 100.0) / 100.0);
                data.put("tareasCompletadas", tareasCompletadas);
                data.put("promedioMatematicas", Math.round(promedioMatematicas * 100.0) / 100.0);
                data.put("promedioCiencias", Math.round(promedioCiencias * 100.0) / 100.0);
                data.put("resultado", resultado);
                studentData.put(student.getId(), data);
            }
            
            // 4. Entrenar modelo J48 (árbol de decisión)
            J48 tree = new J48();
            tree.buildClassifier(dataset);
            
            // 5. Generar predicciones y recomendaciones (sin duplicados)
            List<Map<String, Object>> predictions = new ArrayList<>();
            Set<Long> processedStudents = new HashSet<>();
            
            for (Map.Entry<Long, Map<String, Object>> entry : studentData.entrySet()) {
                Long studentId = entry.getKey();
                
                // Evitar duplicados
                if (processedStudents.contains(studentId)) {
                    continue;
                }
                processedStudents.add(studentId);
                
                Map<String, Object> data = entry.getValue();
                String resultado = (String) data.get("resultado");
                
                Map<String, Object> prediction = new HashMap<>(data);
                prediction.put("studentId", studentId); // Agregar ID para debugging
                
                // Agregar recomendaciones
                if ("REPROBADO".equals(resultado)) {
                    prediction.put("riesgo", "ALTO");
                    prediction.put("recomendacion", "Requiere atención inmediata. Programar tutorías y seguimiento personalizado.");
                } else if ("EN_RIESGO".equals(resultado)) {
                    prediction.put("riesgo", "MEDIO");
                    prediction.put("recomendacion", "Necesita apoyo adicional. Reforzar temas débiles y monitorear progreso.");
                } else {
                    prediction.put("riesgo", "BAJO");
                    prediction.put("recomendacion", "Buen desempeño. Continuar con el ritmo actual.");
                }
                
                predictions.add(prediction);
            }
            
            // 6. Preparar respuesta
            Map<String, Object> response = new HashMap<>();
            response.put("grado", grade);
            response.put("totalEstudiantes", predictions.size());
            response.put("predicciones", predictions);
            response.put("modelo", tree.toString());
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
