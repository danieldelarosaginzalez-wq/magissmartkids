#!/usr/bin/env python3
"""
Genera e inserta 20,000 usuarios directamente en Railway MySQL
"""
import mysql.connector
import random

# Contraseña hasheada con BCrypt para "password123"
PASSWORD_HASH = "$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYIxMdelzK."

# Nombres y apellidos
FIRST_NAMES = [
    "Juan", "María", "Carlos", "Ana", "Luis", "Carmen", "Pedro", "Laura", "Miguel", "Isabel",
    "José", "Patricia", "Francisco", "Sofía", "Antonio", "Marta", "Manuel", "Elena", "David", "Rosa",
    "Diego", "Valentina", "Sebastián", "Camila", "Mateo", "Daniela", "Santiago", "Martina"
]

LAST_NAMES = [
    "García", "Rodríguez", "Martínez", "López", "González", "Hernández", "Pérez", "Sánchez",
    "Ramírez", "Torres", "Flores", "Rivera", "Gómez", "Díaz", "Cruz", "Morales", "Reyes",
    "Gutiérrez", "Ortiz", "Chávez", "Ruiz", "Jiménez", "Mendoza", "Vargas", "Castro"
]

# Credenciales de Railway
config = {
    'host': 'hopper.proxy.rlwy.net',
    'port': 27465,
    'user': 'root',
    'password': 'zMGpvaACSqBkzpSepGfkVGCuWOdtmBQK',
    'database': 'railway'
}

def insert_users(cursor, role, count, start_index=1):
    """Inserta usuarios en la base de datos"""
    role_prefix = role.lower()
    inserted = 0
    
    for i in range(start_index, start_index + count):
        first_name = random.choice(FIRST_NAMES)
        last_name = random.choice(LAST_NAMES)
        email = f"{role_prefix}{i}@altiusacademy.com"
        
        try:
            cursor.execute("""
                INSERT INTO users (email, password, first_name, last_name, role, is_active, created_at, updated_at)
                VALUES (%s, %s, %s, %s, %s, true, NOW(), NOW())
            """, (email, PASSWORD_HASH, first_name, last_name, role))
            inserted += 1
            
            if inserted % 100 == 0:
                print(f"  {role}: {inserted}/{count} usuarios insertados...")
        except mysql.connector.IntegrityError:
            # Usuario ya existe, continuar
            pass
    
    return inserted

print("=" * 60)
print("INSERTANDO 20,000 USUARIOS EN RAILWAY MYSQL")
print("=" * 60)
print("\nConectando a Railway MySQL...")

try:
    conn = mysql.connector.connect(**config)
    cursor = conn.cursor()
    
    print("✅ Conectado exitosamente!\n")
    
    # Insertar administradores
    print("📝 Insertando 10 Administradores...")
    admins = insert_users(cursor, "ADMIN", 10)
    conn.commit()
    print(f"✅ {admins} administradores insertados\n")
    
    # Insertar coordinadores
    print("📝 Insertando 100 Coordinadores...")
    coords = insert_users(cursor, "COORDINATOR", 100)
    conn.commit()
    print(f"✅ {coords} coordinadores insertados\n")
    
    # Insertar profesores
    print("📝 Insertando 1,890 Profesores...")
    teachers = insert_users(cursor, "TEACHER", 1890)
    conn.commit()
    print(f"✅ {teachers} profesores insertados\n")
    
    # Insertar estudiantes
    print("📝 Insertando 18,000 Estudiantes...")
    print("(Esto puede tardar varios minutos...)\n")
    students = insert_users(cursor, "STUDENT", 18000)
    conn.commit()
    print(f"✅ {students} estudiantes insertados\n")
    
    print("=" * 60)
    print("✅ INSERCIÓN COMPLETADA!")
    print("=" * 60)
    
    # Verificar usuarios insertados
    print("\n📊 Verificando usuarios en la base de datos...\n")
    cursor.execute("SELECT role, COUNT(*) as total FROM users GROUP BY role ORDER BY role")
    results = cursor.fetchall()
    
    print("Resumen de usuarios:")
    print("-" * 40)
    total_users = 0
    for role, count in results:
        print(f"  {role:15} {count:>10,}")
        total_users += count
    print("-" * 40)
    print(f"  {'TOTAL':15} {total_users:>10,}")
    print("=" * 60)
    
    print("\n✅ Script completado exitosamente!")
    print("\nCredenciales de acceso:")
    print("  Email: admin1@altiusacademy.com")
    print("  Password: password123")
    
    cursor.close()
    conn.close()
    
except mysql.connector.Error as err:
    print(f"\n❌ Error de MySQL: {err}")
except Exception as e:
    print(f"\n❌ Error: {e}")
