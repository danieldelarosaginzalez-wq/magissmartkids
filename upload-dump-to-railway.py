#!/usr/bin/env python3
"""
Sube un dump SQL a Railway MySQL
"""
import mysql.connector
import sys
import re

# Credenciales de Railway
config = {
    'host': 'hopper.proxy.rlwy.net',
    'port': 27465,
    'user': 'root',
    'password': 'zMGpvaACSqBkzpSepGfkVGCuWOdtmBQK',
    'database': 'railway',
    'autocommit': False
}

print("=" * 60)
print("SUBIENDO DUMP SQL A RAILWAY MYSQL")
print("=" * 60)

try:
    print("\n📂 Leyendo archivo dump-database-fixed.sql...")
    with open('dump-database-fixed.sql', 'r', encoding='utf-8', errors='ignore') as f:
        sql_content = f.read()
    
    print(f"✅ Archivo leído: {len(sql_content):,} caracteres\n")
    
    print("🔌 Conectando a Railway MySQL...")
    conn = mysql.connector.connect(**config)
    cursor = conn.cursor()
    print("✅ Conectado exitosamente!\n")
    
    # Dividir en statements
    print("📝 Procesando statements SQL...")
    
    # Remover comentarios
    sql_content = re.sub(r'--.*$', '', sql_content, flags=re.MULTILINE)
    sql_content = re.sub(r'/\*.*?\*/', '', sql_content, flags=re.DOTALL)
    
    # Dividir por punto y coma
    statements = [s.strip() for s in sql_content.split(';') if s.strip()]
    
    print(f"📊 Total de statements: {len(statements)}\n")
    print("⏳ Ejecutando... (esto puede tardar varios minutos)\n")
    
    executed = 0
    errors = 0
    
    for i, statement in enumerate(statements, 1):
        if not statement or len(statement) < 10:
            continue
            
        try:
            cursor.execute(statement)
            executed += 1
            
            if executed % 100 == 0:
                conn.commit()
                print(f"  Progreso: {executed}/{len(statements)} statements ejecutados...")
                
        except mysql.connector.Error as err:
            errors += 1
            if errors <= 5:  # Solo mostrar los primeros 5 errores
                print(f"  ⚠️  Error en statement {i}: {str(err)[:80]}")
    
    # Commit final
    conn.commit()
    
    print("\n" + "=" * 60)
    print("✅ IMPORTACIÓN COMPLETADA!")
    print("=" * 60)
    print(f"\n📊 Estadísticas:")
    print(f"  Statements ejecutados: {executed}")
    print(f"  Errores: {errors}")
    
    # Verificar tablas y datos
    print("\n📋 Verificando datos importados...\n")
    
    cursor.execute("SHOW TABLES")
    tables = cursor.fetchall()
    print(f"Tablas en la base de datos: {len(tables)}")
    
    # Verificar usuarios si existe la tabla
    try:
        cursor.execute("SELECT COUNT(*) FROM users")
        user_count = cursor.fetchone()[0]
        print(f"Total de usuarios: {user_count:,}")
        
        cursor.execute("SELECT role, COUNT(*) FROM users GROUP BY role")
        for role, count in cursor.fetchall():
            print(f"  {role}: {count:,}")
    except:
        print("  (Tabla users no encontrada o vacía)")
    
    print("\n" + "=" * 60)
    print("✅ Script completado!")
    print("=" * 60)
    
    cursor.close()
    conn.close()
    
except FileNotFoundError:
    print("\n❌ Error: No se encontró el archivo 'dump-database.sql'")
    print("   Asegúrate de que el archivo esté en el directorio actual.")
    sys.exit(1)
except mysql.connector.Error as err:
    print(f"\n❌ Error de MySQL: {err}")
    sys.exit(1)
except Exception as e:
    print(f"\n❌ Error: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)
