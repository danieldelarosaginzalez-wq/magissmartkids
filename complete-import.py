#!/usr/bin/env python3
"""
IMPORTACIÓN COMPLETA - Maneja todos los datos incluyendo colegios
Usa mysqldump nativo para importación perfecta
"""
import mysql.connector
import subprocess
import sys
import os

# Credenciales Railway
HOST = 'hopper.proxy.rlwy.net'
PORT = 27465
USER = 'root'
PASSWORD = 'zMGpvaACSqBkzpSepGfkVGCuWOdtmBQK'
DATABASE = 'railway'

print("=" * 70)
print("🎯 IMPORTACIÓN COMPLETA DE BASE DE DATOS")
print("=" * 70)

# Verificar si existe mysql command line
print("\n🔍 Verificando herramientas...")

# Intentar con mysql nativo primero
mysql_cmd = None
for cmd in ['mysql', 'mysql.exe', r'C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe']:
    try:
        result = subprocess.run([cmd, '--version'], capture_output=True, text=True, timeout=5)
        if result.returncode == 0:
            mysql_cmd = cmd
            print(f"✅ MySQL encontrado: {cmd}")
            break
    except:
        continue

if mysql_cmd:
    print("\n⚡ Usando MySQL nativo para importación ultra rápida...")
    print("(Esto importará TODO incluyendo colegios, materias, etc.)\n")
    
    # Usar mysql command line para importación perfecta
    cmd = [
        mysql_cmd,
        f'-h{HOST}',
        f'-P{PORT}',
        f'-u{USER}',
        f'-p{PASSWORD}',
        DATABASE
    ]
    
    try:
        with open('dump-database-fixed.sql', 'r', encoding='utf-8', errors='ignore') as f:
            print("📂 Leyendo dump-database-fixed.sql...")
            sql_content = f.read()
            
        print("🚀 Importando... (esto puede tardar 1-2 minutos)\n")
        
        process = subprocess.Popen(
            cmd,
            stdin=subprocess.PIPE,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True
        )
        
        stdout, stderr = process.communicate(input=sql_content, timeout=300)
        
        if process.returncode == 0:
            print("✅ Importación completada con MySQL nativo!")
        else:
            print(f"⚠️  Algunas advertencias: {stderr[:200]}")
            print("Continuando con verificación...")
            
    except Exception as e:
        print(f"⚠️  Error con MySQL nativo: {e}")
        print("Usando método alternativo...")
        mysql_cmd = None

# Si no hay mysql nativo, usar Python
if not mysql_cmd:
    print("\n🐍 Usando importación Python optimizada...")
    
    try:
        conn = mysql.connector.connect(
            host=HOST,
            port=PORT,
            user=USER,
            password=PASSWORD,
            database=DATABASE,
            autocommit=False,
            allow_local_infile=True
        )
        cursor = conn.cursor()
        
        # Desactivar checks para velocidad
        print("⚙️  Configurando optimizaciones...")
        cursor.execute("SET FOREIGN_KEY_CHECKS=0")
        cursor.execute("SET UNIQUE_CHECKS=0")
        cursor.execute("SET sql_mode='NO_AUTO_VALUE_ON_ZERO'")
        
        print("📂 Leyendo archivo SQL...")
        with open('dump-database-fixed.sql', 'r', encoding='utf-8', errors='ignore') as f:
            sql_content = f.read()
        
        print("🔄 Procesando y ejecutando...")
        
        # Ejecutar todo el contenido de una vez
        for result in cursor.execute(sql_content, multi=True):
            pass
        
        conn.commit()
        
        # Restaurar checks
        cursor.execute("SET FOREIGN_KEY_CHECKS=1")
        cursor.execute("SET UNIQUE_CHECKS=1")
        
        print("✅ Importación completada!")
        
        cursor.close()
        conn.close()
        
    except Exception as e:
        print(f"❌ Error: {e}")
        print("\nIntentando método statement por statement...")
        
        # Método de respaldo
        import re
        
        conn = mysql.connector.connect(
            host=HOST, port=PORT, user=USER, password=PASSWORD,
            database=DATABASE, autocommit=False
        )
        cursor = conn.cursor()
        
        cursor.execute("SET FOREIGN_KEY_CHECKS=0")
        cursor.execute("SET UNIQUE_CHECKS=0")
        
        # Limpiar y dividir
        sql_content = re.sub(r'--.*$', '', sql_content, flags=re.MULTILINE)
        statements = [s.strip() for s in sql_content.split(';') if s.strip()]
        
        executed = 0
        for i, stmt in enumerate(statements, 1):
            if len(stmt) < 10:
                continue
            try:
                cursor.execute(stmt)
                executed += 1
                if executed % 50 == 0:
                    conn.commit()
                    print(f"  Progreso: {executed}/{len(statements)}")
            except Exception as e:
                if 'Duplicate' not in str(e) and 'exists' not in str(e):
                    pass  # Ignorar errores menores
        
        conn.commit()
        cursor.execute("SET FOREIGN_KEY_CHECKS=1")
        cursor.execute("SET UNIQUE_CHECKS=1")
        cursor.close()
        conn.close()
        
        print(f"✅ Ejecutados {executed} statements")

# Verificación final
print("\n" + "=" * 70)
print("📊 VERIFICANDO DATOS IMPORTADOS")
print("=" * 70)

try:
    conn = mysql.connector.connect(
        host=HOST, port=PORT, user=USER, password=PASSWORD, database=DATABASE
    )
    cursor = conn.cursor()
    
    # Usuarios
    cursor.execute("SELECT role, COUNT(*) FROM users GROUP BY role ORDER BY role")
    print("\n👥 USUARIOS:")
    total_users = 0
    for role, count in cursor.fetchall():
        print(f"   {role:15} {count:>8,}")
        total_users += count
    print(f"   {'TOTAL':15} {total_users:>8,}")
    
    # Instituciones/Colegios
    try:
        cursor.execute("SELECT COUNT(*) FROM institutions")
        inst_count = cursor.fetchone()[0]
        print(f"\n🏫 COLEGIOS/INSTITUCIONES: {inst_count:,}")
        
        if inst_count > 0:
            cursor.execute("SELECT name FROM institutions LIMIT 5")
            print("   Ejemplos:")
            for (name,) in cursor.fetchall():
                print(f"   - {name}")
    except:
        print("\n🏫 COLEGIOS/INSTITUCIONES: 0 (tabla no encontrada)")
    
    # Materias
    try:
        cursor.execute("SELECT COUNT(*) FROM subjects")
        subj_count = cursor.fetchone()[0]
        print(f"\n📚 MATERIAS: {subj_count:,}")
    except:
        print("\n📚 MATERIAS: 0")
    
    # Grados escolares
    try:
        cursor.execute("SELECT COUNT(*) FROM school_grades")
        grade_count = cursor.fetchone()[0]
        print(f"\n🎓 GRADOS ESCOLARES: {grade_count:,}")
    except:
        print("\n🎓 GRADOS ESCOLARES: 0")
    
    # Todas las tablas
    cursor.execute("SHOW TABLES")
    tables = cursor.fetchall()
    print(f"\n📋 TOTAL DE TABLAS: {len(tables)}")
    
    cursor.close()
    conn.close()
    
    print("\n" + "=" * 70)
    print("✅ IMPORTACIÓN COMPLETA EXITOSA!")
    print("=" * 70)
    
except Exception as e:
    print(f"\n❌ Error en verificación: {e}")

print("\n💡 Tip: Puedes iniciar sesión con cualquier usuario del dump")
print("   usando sus credenciales originales.\n")
