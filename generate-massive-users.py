#!/usr/bin/env python3
"""
Generador de datos masivos para Altius Academy
Genera 20,000 usuarios distribuidos en:
- 10 Administradores
- 100 Coordinadores
- 1,890 Profesores
- 18,000 Estudiantes
"""

import random

# Contraseña hasheada con BCrypt para "password123"
PASSWORD_HASH = "$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYIxMdelzK."

# Nombres y apellidos comunes en español
FIRST_NAMES = [
    "Juan", "María", "Carlos", "Ana", "Luis", "Carmen", "Pedro", "Laura", "Miguel", "Isabel",
    "José", "Patricia", "Francisco", "Sofía", "Antonio", "Marta", "Manuel", "Elena", "David", "Rosa",
    "Javier", "Lucía", "Daniel", "Paula", "Rafael", "Cristina", "Alejandro", "Beatriz", "Fernando", "Raquel",
    "Sergio", "Silvia", "Pablo", "Pilar", "Jorge", "Teresa", "Alberto", "Dolores", "Ángel", "Mercedes",
    "Andrés", "Amparo", "Rubén", "Montserrat", "Adrián", "Inmaculada", "Iván", "Concepción", "Óscar", "Josefa",
    "Diego", "Valentina", "Sebastián", "Camila", "Mateo", "Daniela", "Santiago", "Martina", "Nicolás", "Emma",
    "Lucas", "Mía", "Benjamín", "Victoria", "Emiliano", "Renata", "Joaquín", "Catalina", "Maximiliano", "Antonella"
]

LAST_NAMES = [
    "García", "Rodríguez", "Martínez", "López", "González", "Hernández", "Pérez", "Sánchez", "Ramírez", "Torres",
    "Flores", "Rivera", "Gómez", "Díaz", "Cruz", "Morales", "Reyes", "Gutiérrez", "Ortiz", "Chávez",
    "Ruiz", "Jiménez", "Mendoza", "Vargas", "Castro", "Romero", "Álvarez", "Medina", "Herrera", "Aguilar",
    "Silva", "Rojas", "Vega", "Peña", "Cortés", "Navarro", "Campos", "Paredes", "Ríos", "Molina",
    "Salazar", "Fuentes", "Carrillo", "Ponce", "Ibarra", "Cárdenas", "Sandoval", "Espinoza", "Domínguez", "Vázquez"
]

def generate_users(role, count, start_index=1):
    """Genera usuarios SQL INSERT statements"""
    users = []
    role_prefix = role.lower()
    
    for i in range(start_index, start_index + count):
        first_name = random.choice(FIRST_NAMES)
        last_name = random.choice(LAST_NAMES)
        email = f"{role_prefix}{i}@altiusacademy.com"
        
        user = f"('{email}', '{PASSWORD_HASH}', '{first_name}', '{last_name}', '{role}', true, NOW(), NOW())"
        users.append(user)
    
    return users

def main():
    print("-- ============================================")
    print("-- SCRIPT DE INSERCIÓN MASIVA - 20,000 USUARIOS")
    print("-- ============================================")
    print("-- Distribución:")
    print("-- - 10 Administradores")
    print("-- - 100 Coordinadores")
    print("-- - 1,890 Profesores")
    print("-- - 18,000 Estudiantes")
    print("-- ============================================")
    print("-- Contraseña para todos: password123")
    print("-- ============================================\n")
    
    # Generar administradores
    print("-- ============================================")
    print("-- ADMINISTRADORES (10)")
    print("-- ============================================")
    admins = generate_users("ADMIN", 10)
    print("INSERT INTO users (email, password, first_name, last_name, role, is_active, created_at, updated_at) VALUES")
    print(",\n".join(admins) + ";\n")
    
    # Generar coordinadores
    print("-- ============================================")
    print("-- COORDINADORES (100)")
    print("-- ============================================")
    coordinators = generate_users("COORDINATOR", 100)
    print("INSERT INTO users (email, password, first_name, last_name, role, is_active, created_at, updated_at) VALUES")
    print(",\n".join(coordinators) + ";\n")
    
    # Generar profesores en lotes de 500
    print("-- ============================================")
    print("-- PROFESORES (1,890)")
    print("-- ============================================")
    batch_size = 500
    total_teachers = 1890
    
    for batch_start in range(1, total_teachers + 1, batch_size):
        batch_count = min(batch_size, total_teachers - batch_start + 1)
        teachers = generate_users("TEACHER", batch_count, batch_start)
        print(f"-- Lote {(batch_start-1)//batch_size + 1} de profesores")
        print("INSERT INTO users (email, password, first_name, last_name, role, is_active, created_at, updated_at) VALUES")
        print(",\n".join(teachers) + ";\n")
    
    # Generar estudiantes en lotes de 1000
    print("-- ============================================")
    print("-- ESTUDIANTES (18,000)")
    print("-- ============================================")
    batch_size = 1000
    total_students = 18000
    
    for batch_start in range(1, total_students + 1, batch_size):
        batch_count = min(batch_size, total_students - batch_start + 1)
        students = generate_users("STUDENT", batch_count, batch_start)
        print(f"-- Lote {(batch_start-1)//batch_size + 1} de estudiantes")
        print("INSERT INTO users (email, password, first_name, last_name, role, is_active, created_at, updated_at) VALUES")
        print(",\n".join(students) + ";\n")
    
    print("-- ============================================")
    print("-- RESUMEN")
    print("-- ============================================")
    print("-- Total de usuarios creados: 20,000")
    print("-- ")
    print("-- Para verificar:")
    print("-- SELECT role, COUNT(*) as total FROM users GROUP BY role;")
    print("-- ")
    print("-- Usuarios de ejemplo:")
    print("-- Admin: admin1@altiusacademy.com")
    print("-- Coordinador: coordinator1@altiusacademy.com")
    print("-- Profesor: teacher1@altiusacademy.com")
    print("-- Estudiante: student1@altiusacademy.com")
    print("-- ")
    print("-- Contraseña: password123")
    print("-- ============================================")

if __name__ == "__main__":
    main()
