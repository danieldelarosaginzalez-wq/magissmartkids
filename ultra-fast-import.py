#!/usr/bin/env python3
"""
ULTRA FAST SQL IMPORT - Optimizado para máxima velocidad
Usa técnicas avanzadas: bulk inserts, transacciones grandes, multi-threading
"""
import mysql.connector
from mysql.connector import Error
import re
import sys
from concurrent.futures import ThreadPoolExecutor, as_completed
import time

# Credenciales Railway
CONFIG = {
    'host': 'hopper.proxy.rlwy.net',
    'port': 27465,
    'user': 'root',
    'password': 'zMGpvaACSqBkzpSepGfkVGCuWOdtmBQK',
    'database': 'railway',
    'autocommit': False,
    'use_pure': True  # Usa Python puro para compatibilidad
}

def get_connection():
    """Crea una conexión optimizada"""
    conn = mysql.connector.connect(**CONFIG)
    cursor = conn.cursor()
    
    # Optimizaciones de MySQL para importación masiva
    cursor.execute("SET FOREIGN_KEY_CHECKS=0")
    cursor.execute("SET UNIQUE_CHECKS=0")
    cursor.execute("SET AUTOCOMMIT=0")
    cursor.execute("SET sql_log_bin=0")
    cursor.execute("SET SESSION transaction_isolation='READ-UNCOMMITTED'")
    
    return conn, cursor

def clean_sql(content):
    """Limpia y prepara el SQL"""
    # Remover comentarios
    content = re.sub(r'--.*$', '', content, flags=re.MULTILINE)
    content = re.sub(r'/\*.*?\*/', '', content, flags=re.DOTALL)
    
    # Reemplazar nombre de base de datos
    content = content.replace('altiusv3', 'railway')
    content = re.sub(r'USE `.*?`;', 'USE `railway`;', content)
    
    # Remover comandos problemáticos
    content = re.sub(r'DROP TABLE IF EXISTS.*?;', '', content, flags=re.IGNORECASE)
    
    return content

def split_statements(content):
    """Divide el SQL en statements optimizados"""
    statements = []
    current = []
    in_insert = False
    
    for line in content.split('\n'):
        line = line.strip()
        if not line:
            continue
            
        # Detectar inicio de INSERT
        if line.upper().startswith('INSERT INTO'):
            in_insert = True
            current = [line]
        elif in_insert:
            current.append(line)
            # Si termina con ;, es el final del INSERT
            if line.endswith(';'):
                statements.append('\n'.join(current))
                current = []
                in_insert = False
        else:
            # Otros statements (CREATE TABLE, etc)
            if line.endswith(';'):
                statements.append(line)
            else:
                current.append(line)
                if ';' in line:
                    statements.append('\n'.join(current))
                    current = []
    
    return statements

def execute_batch(statements, batch_id):
    """Ejecuta un lote de statements en paralelo"""
    conn, cursor = get_connection()
    executed = 0
    errors = 0
    
    try:
        for stmt in statements:
            if len(stmt) < 10:
                continue
            try:
                cursor.execute(stmt)
                executed += 1
            except Error as e:
                errors += 1
                if 'Duplicate entry' not in str(e) and 'already exists' not in str(e):
                    if errors <= 3:
                        print(f"  ⚠️  Batch {batch_id} error: {str(e)[:60]}")
        
        conn.commit()
        return executed, errors
    finally:
        cursor.close()
        conn.close()

def main():
    print("=" * 70)
    print("🚀 ULTRA FAST SQL IMPORT - MÁXIMA VELOCIDAD")
    print("=" * 70)
    
    start_time = time.time()
    
    # Leer archivo
    print("\n📂 Leyendo dump-database-fixed.sql...")
    try:
        with open('dump-database-fixed.sql', 'r', encoding='utf-8', errors='ignore') as f:
            content = f.read()
    except FileNotFoundError:
        print("❌ Archivo no encontrado. Generando desde dump-database.sql...")
        with open('dump-database.sql', 'r', encoding='utf-8', errors='ignore') as f:
            content = f.read()
    
    print(f"✅ Leído: {len(content):,} caracteres")
    
    # Limpiar SQL
    print("\n🧹 Limpiando y optimizando SQL...")
    content = clean_sql(content)
    
    # Dividir en statements
    print("📝 Dividiendo en statements...")
    statements = split_statements(content)
    statements = [s for s in statements if s.strip()]
    
    print(f"✅ {len(statements)} statements preparados")
    
    # Dividir en lotes para procesamiento paralelo
    BATCH_SIZE = 50
    batches = [statements[i:i+BATCH_SIZE] for i in range(0, len(statements), BATCH_SIZE)]
    
    print(f"\n⚡ Ejecutando {len(batches)} lotes en paralelo...")
    print("(Usando multi-threading para máxima velocidad)\n")
    
    total_executed = 0
    total_errors = 0
    
    # Ejecutar en paralelo con ThreadPoolExecutor
    with ThreadPoolExecutor(max_workers=4) as executor:
        futures = {executor.submit(execute_batch, batch, i): i 
                  for i, batch in enumerate(batches, 1)}
        
        for future in as_completed(futures):
            batch_id = futures[future]
            try:
                executed, errors = future.result()
                total_executed += executed
                total_errors += errors
                print(f"  ✅ Batch {batch_id}/{len(batches)} completado: {executed} statements")
            except Exception as e:
                print(f"  ❌ Batch {batch_id} falló: {e}")
    
    elapsed = time.time() - start_time
    
    print("\n" + "=" * 70)
    print("✅ IMPORTACIÓN COMPLETADA!")
    print("=" * 70)
    print(f"\n📊 Estadísticas:")
    print(f"  Tiempo total: {elapsed:.2f} segundos")
    print(f"  Statements ejecutados: {total_executed:,}")
    print(f"  Errores (ignorados): {total_errors}")
    print(f"  Velocidad: {total_executed/elapsed:.1f} statements/segundo")
    
    # Verificar datos
    print("\n📋 Verificando datos importados...\n")
    conn, cursor = get_connection()
    
    try:
        cursor.execute("SELECT COUNT(*) FROM users")
        user_count = cursor.fetchone()[0]
        print(f"✅ Total usuarios: {user_count:,}")
        
        cursor.execute("SELECT role, COUNT(*) FROM users GROUP BY role ORDER BY role")
        for role, count in cursor.fetchall():
            print(f"   {role:15} {count:>8,}")
        
        cursor.execute("SHOW TABLES")
        tables = cursor.fetchall()
        print(f"\n✅ Total tablas: {len(tables)}")
        
        # Restaurar configuración normal
        cursor.execute("SET FOREIGN_KEY_CHECKS=1")
        cursor.execute("SET UNIQUE_CHECKS=1")
        cursor.execute("SET AUTOCOMMIT=1")
        
    except Error as e:
        print(f"⚠️  Error verificando: {e}")
    finally:
        cursor.close()
        conn.close()
    
    print("\n" + "=" * 70)
    print("🎉 ¡IMPORTACIÓN ULTRA RÁPIDA COMPLETADA!")
    print("=" * 70)

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n⚠️  Importación cancelada por el usuario")
        sys.exit(1)
    except Exception as e:
        print(f"\n❌ Error fatal: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
