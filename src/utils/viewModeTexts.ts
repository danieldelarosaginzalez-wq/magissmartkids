type ViewMode = 'academic' | 'tutoring';

export const getViewModeText = (mode: ViewMode, key: string): string => {
    const texts: Record<string, { academic: string; tutoring: string }> = {
        // Términos generales
        'subjects': { academic: 'Materias', tutoring: 'Áreas de Refuerzo' },
        'subject': { academic: 'Materia', tutoring: 'Área de Refuerzo' },
        'teachers': { academic: 'Profesores', tutoring: 'Tutores' },
        'teacher': { academic: 'Profesor', tutoring: 'Tutor' },
        'students': { academic: 'Estudiantes', tutoring: 'Estudiantes en Refuerzo' },
        'student': { academic: 'Estudiante', tutoring: 'Estudiante' },
        'grades': { academic: 'Calificaciones', tutoring: 'Progreso' },
        'grade': { academic: 'Calificación', tutoring: 'Nivel de Progreso' },
        'tasks': { academic: 'Tareas', tutoring: 'Actividades de Práctica' },
        'task': { academic: 'Tarea', tutoring: 'Actividad' },
        'assignments': { academic: 'Asignaciones', tutoring: 'Ejercicios' },
        'assignment': { academic: 'Asignación', tutoring: 'Ejercicio' },

        // Dashboard
        'mySubjects': { academic: 'Mis Materias', tutoring: 'Mis Grupos de Refuerzo' },
        'myTasks': { academic: 'Mis Tareas', tutoring: 'Mis Actividades' },
        'myProgress': { academic: 'Mi Rendimiento', tutoring: 'Mi Progreso' },

        // Acciones
        'createSubject': { academic: 'Crear Materia', tutoring: 'Crear Área de Refuerzo' },
        'assignTeacher': { academic: 'Asignar Profesor', tutoring: 'Asignar Tutor' },
        'viewGrades': { academic: 'Ver Calificaciones', tutoring: 'Ver Progreso' },

        // Descripciones
        'subjectDescription': {
            academic: 'Gestiona las materias de tu institución',
            tutoring: 'Gestiona las áreas de refuerzo académico'
        },
        'teacherDescription': {
            academic: 'Administra los profesores y sus asignaciones',
            tutoring: 'Administra los tutores y sus grupos de refuerzo'
        },
    };

    return texts[key]?.[mode] || key;
};

export const getGradeDisplay = (grade: number, mode: ViewMode): string => {
    if (mode === 'academic') {
        return grade.toFixed(1);
    }

    // Modo refuerzo: convertir a escala cualitativa
    if (grade < 2.5) return '🔴 Inicial';
    if (grade < 3.5) return '🟡 En Proceso';
    if (grade < 4.5) return '🟢 Logrado';
    return '🌟 Destacado';
};

export const getGradeColor = (grade: number, mode: ViewMode): string => {
    if (mode === 'academic') {
        if (grade >= 4.0) return 'text-green-600';
        if (grade >= 3.0) return 'text-blue-600';
        if (grade >= 2.0) return 'text-yellow-600';
        return 'text-red-600';
    }

    // Modo refuerzo
    if (grade < 2.5) return 'text-red-600';
    if (grade < 3.5) return 'text-yellow-600';
    if (grade < 4.5) return 'text-green-600';
    return 'text-purple-600';
};
