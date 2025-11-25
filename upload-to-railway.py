#!/usr/bin/env python3
"""
Script para subir usuarios a Railway MySQL
"""
import mysql.connector
import sys

# Credenciales de Railway
config = {
    'host': 'hopper.proxy.rlwy.net',
    'port': 27465,
    'user': 'root',
    'password': 'zMGpvaACSqBkzpSepGfkVGCuWOdtmBQK',
    'database': 'railway'
}

print("=" * 50)
print("Conectando a Railway MySQL...")
print("=" * 50)

try:
    # Conectar a MySQL
    conn = mysql.connector.connect(**config)
    cursor = conn.cursor()
    
    print("✅ Conectado exitosamente!")
    print("\nLeyendo archivo SQL...")
    
    # Leer el archivo SQL
    with open('insert-20k-users.sql', 'r', encoding='utf-8') as f:
        sql_content = f.read()
    
    # Dividir en statements individuales
    statements = sql_content.split(';')
    
    total = len([s for s in statements if s.strip()])
    print(f"📝 Encontrados {total} statements SQL")
    print("\nEjecutando inserts...")
    print("Esto puede tardar varios minutos...\n")
    
    executed = 0
    for statement in statements:
        statement = statement.strip()
        if statement and not statement.startswith('--'):
            try:
                cursor.execute(statement)
                executed += 1
                if executed % 5 == 0:
                    print(f"  Progreso: {executed}/{total} statements ejecutados...")
            except Exception as e:
                if 'Duplicate entry' not in str(e):
                    print(f"⚠️  Error en statement: {str(e)[:100]}")
    
    # Commit de todos los cambios
    conn.commit()
    
    print("\n" + "=" * 50)
    print("✅ Todos los inserts completados!")
    print("=" * 50)
    
    # Verificar usuarios insertados
    print("\nVerificando usuarios insertados...")
    cursor.execute("SELECT role, COUNT(*) as total FROM users GROUP BY role")
    results = cursor.fetchall()
    
    print("\n📊 Resumen de usuarios:")
    print("-" * 30)
    total_users = 0
    for role, count in results:
        print(f"  {role:15} {count:>6,}")
        total_users += count
    print("-" * 30)
    print(f"  {'TOTAL':15} {total_users:>6,}")
    print("=" * 50)
    
    cursor.close()
    conn.close()
    
    print("\n✅ Script completado exitosamente!")
    
except mysql.connector.Error as err:
    print(f"\n❌ Error de MySQL: {err}")
    sys.exit(1)
except FileNotFoundError:
    print("\n❌ Error: No se encontró el archivo 'insert-20k-users.sql'")
    print("   Asegúrate de ejecutar este script desde el directorio correcto.")
    sys.exit(1)
except Exception as e:
    print(f"\n❌ Error inesperado: {e}")
    sys.exit(1)
