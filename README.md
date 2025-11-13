# ✨ MagicSmartKids Platform

**Plataforma educativa interactiva que transforma el aprendizaje en una experiencia mágica y divertida para niños.**

[![Status](https://img.shields.io/badge/Status-Producción-green)](https://github.com/magicsmartkids/platform)
[![Frontend](https://img.shields.io/badge/Frontend-React%2018-blue)](https://reactjs.org/)
[![Backend](https://img.shields.io/badge/Backend-Spring%20Boot%203.2-green)](https://spring.io/projects/spring-boot)
[![Database](https://img.shields.io/badge/Database-MySQL%208.0-orange)](https://www.mysql.com/)
[![Magic](https://img.shields.io/badge/Magic-✨%20Enabled-purple)](https://magicsmartkids.com)

---

## 🚀 **INICIO RÁPIDO**

### **Opción 1: Inicio Automático (Recomendado)**
```powershell
# Ejecutar script de inicio automático
./start-magicsmartkids.ps1
```

### **Opción 2: Inicio Manual**
```bash
# 1. Iniciar Backend
cd backend
mvn spring-boot:run

# 2. En otra terminal - Iniciar Frontend
npm install
npm run dev
```

### **Verificación del Sistema**
```powershell
# Verificar que todo funcione correctamente
./test-complete-system.ps1
```

---

## 🎯 **CARACTERÍSTICAS PRINCIPALES**

### **📊 Dashboards Especializados por Rol**
- **👨‍💼 Administrador**: Control total del sistema, estadísticas globales, gestión de instituciones

- **👨‍🏫 Coordinador**: Gestión institucional, supervisión de profesores y estudiantes
- **👩‍🏫 Profesor**: Actividades interactivas, gestión de materias, calificaciones
- **👨‍🎓 Estudiante**: Progreso académico, tareas pendientes, actividades interactivas


### **🎮 Sistema de Actividades Interactivas**
- **5 tipos de actividades**: Opción múltiple, respuesta corta, drag & drop, unir líneas, video interactivo
- **Editor visual**: Creación intuitiva de actividades
- **Portal del maestro**: Gestión completa de actividades
- **Vista del estudiante**: Interfaz optimizada para resolver actividades
- **Estadísticas en tiempo real**: Seguimiento del progreso

### **🏢 Sistema Multi-Institución**
- **Gestión centralizada**: Múltiples instituciones en una plataforma
- **Roles específicos**: Permisos por institución y rol
- **Estadísticas segmentadas**: Datos por institución y globales
- **Administración flexible**: Configuración independiente por institución

---

## 🛠️ **TECNOLOGÍAS**

### **Frontend**
- **React 18** con TypeScript
- **Vite** como bundler y dev server
- **Tailwind CSS** con paleta corporativa
- **Zustand** para manejo de estado global
- **React Router** para navegación SPA
- **Lucide React** para iconografía
- **Axios** para comunicación con API

### **Backend**
- **Spring Boot 3.2** con Java 17
- **Spring Security** con JWT
- **Spring Data JPA** para MySQL
- **Spring Data MongoDB** para datos no relacionales
- **Maven** para gestión de dependencias
- **Swagger/OpenAPI** para documentación de API

### **Base de Datos**
- **MySQL 8.0** para datos relacionales
- **MongoDB 6.0** para actividades y contenido multimedia
- **Conexión dual** optimizada para cada tipo de dato

---

## 📋 **PRERREQUISITOS**

### **Software Requerido**
- **Java 17+** (OpenJDK o Oracle JDK)
- **Maven 3.8+** para gestión de dependencias
- **Node.js 18+** con npm
- **MySQL 8.0+** servidor de base de datos
- **Git** para control de versiones

### **Verificación de Prerrequisitos**
```bash
java --version    # Debe mostrar Java 17+
mvn --version     # Debe mostrar Maven 3.8+
node --version    # Debe mostrar Node 18+
mysql --version   # Debe mostrar MySQL 8.0+
```

---

## ⚙️ **CONFIGURACIÓN**

### **1. Variables de Entorno**
El archivo `.env` se crea automáticamente con:
```env
VITE_API_BASE_URL=http://localhost:8090/api
DB_HOST=127.0.0.1
DB_PORT=3306
DB_NAME=altiusv3
DB_USER=root
DB_PASSWORD=120994
```

### **2. Base de Datos MySQL**
```sql
-- La base de datos se crea automáticamente
-- Configuración en application.properties:
spring.datasource.url=jdbc:mysql://127.0.0.1:3306/altiusv3?createDatabaseIfNotExist=true
```

### **3. Puertos Utilizados**
- **Frontend**: http://localhost:3001
- **Backend**: http://localhost:8090
- **MySQL**: localhost:3306
- **MongoDB**: localhost:27017

---

## 👥 **USUARIOS DE PRUEBA**

### **Credenciales Predefinidas**
```
🔑 Administrador:  admin@magicsmartkids.com / 123456

🔑 Coordinador:    coordinator@magicsmartkids.com / 123456
🔑 Profesor:       teacher@magicsmartkids.com / 123456
🔑 Estudiante:     student@magicsmartkids.com / 123456

```

### **Creación Automática**
Los usuarios se crean automáticamente al iniciar el sistema o ejecutar:
```powershell
./diagnose-and-fix.ps1
```

---

## 🔗 **ENDPOINTS PRINCIPALES**

### **Autenticación**
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/register` - Registrar usuario
- `POST /api/auth/logout` - Cerrar sesión

### **Dashboards**
- `GET /api/admin/stats` - Estadísticas de administrador

- `GET /api/teacher/stats` - Estadísticas de profesor
- `GET /api/student/stats` - Estadísticas de estudiante


### **Sistema**
- `GET /api/health` - Estado del sistema
- `GET /api/database-test/status` - Estado de la base de datos

---

## 📁 **ESTRUCTURA DEL PROYECTO**

```
MagicSmartKids/
├── 📁 src/                          # Frontend React + TypeScript
│   ├── 📁 components/               # Componentes reutilizables
│   │   ├── 📁 ui/                   # Componentes UI base
│   │   └── 📁 activities/           # Componentes de actividades
│   ├── 📁 pages/                    # Páginas de la aplicación
│   │   ├── 📁 dashboards/           # Dashboards por rol
│   │   ├── Login.tsx                # Página de login
│   │   ├── Register.tsx             # Página de registro
│   │   └── InteractiveActivities.tsx # Sistema de actividades
│   ├── 📁 stores/                   # Estado global (Zustand)
│   ├── 📁 services/                 # Servicios de API
│   ├── 📁 utils/                    # Utilidades y helpers
│   └── 📁 types/                    # Definiciones TypeScript
├── 📁 backend/                      # Backend Spring Boot
│   ├── 📁 src/main/java/            # Código fuente Java
│   │   └── 📁 com/altiusacademy/    # Paquete principal
│   │       ├── 📁 controller/       # Controladores REST
│   │       ├── 📁 service/          # Lógica de negocio
│   │       ├── 📁 model/            # Entidades y DTOs
│   │       └── 📁 repository/       # Repositorios JPA
│   └── 📁 src/main/resources/       # Configuraciones
├── 📄 .env                          # Variables de entorno
├── 📄 package.json                  # Dependencias frontend
├── 📄 tailwind.config.js            # Configuración Tailwind
├── 📄 vite.config.ts                # Configuración Vite
└── 📄 README.md                     # Este archivo
```

---

## 🧪 **TESTING Y DIAGNÓSTICO**

### **Scripts de Verificación**
```powershell
# Verificación completa del sistema
./test-complete-system.ps1

# Diagnóstico y solución de problemas
./diagnose-and-fix.ps1

# Verificación específica del backend
./test-backend-connection.ps1
```

### **Endpoints de Diagnóstico**
- **Health Check**: http://localhost:8090/api/health
- **Database Status**: http://localhost:8090/api/database-test/status
- **API Documentation**: http://localhost:8090/swagger-ui.html

---

## 🎨 **PALETA DE COLORES CORPORATIVA**

```css
/* Colores principales */
--primary: #385ADB;           /* Azul principal */
--secondary: #62A0C2;         /* Azul secundario */
--accent-yellow: #FFDC00;     /* Amarillo de acento */
--accent-green: #28A100;      /* Verde de éxito */
--neutral-white: #FFFFFF;     /* Blanco neutro */
--neutral-black: #000000;     /* Negro neutro */
```

---

## 🚨 **SOLUCIÓN DE PROBLEMAS**

### **Backend no inicia**
```bash
# Verificar Java y Maven
java --version
mvn --version

# Compilar manualmente
cd backend
mvn clean compile
mvn spring-boot:run
```

### **Error de conexión a MySQL**
```bash
# Verificar que MySQL esté corriendo
# Windows: Servicios > MySQL
# XAMPP: Panel de control > MySQL > Start
```

### **Frontend no carga**
```bash
# Reinstalar dependencias
rm -rf node_modules
npm install
npm run dev
```

### **Usuarios de prueba no existen**
```powershell
# Crear usuarios automáticamente
./diagnose-and-fix.ps1
```

---

## 📈 **ROADMAP**

### **Versión Actual (v3.0)**
- ✅ Sistema de dashboards por rol
- ✅ Actividades interactivas completas
- ✅ Autenticación JWT
- ✅ Sistema multi-institución
- ✅ Diseño responsive completo

### **Próximas Versiones**
- 🔄 Sistema de notificaciones en tiempo real
- 🔄 Reportes avanzados con gráficos
- 🔄 Integración con sistemas externos
- 🔄 App móvil nativa
- 🔄 Modo offline

---

## 🤝 **CONTRIBUCIÓN**

### **Proceso de Contribución**
1. **Fork** el repositorio
2. **Crear rama** feature (`git checkout -b feature/nueva-funcionalidad`)
3. **Commit** cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. **Push** a la rama (`git push origin feature/nueva-funcionalidad`)
5. **Crear Pull Request**

### **Estándares de Código**
- **TypeScript** para frontend
- **Java 17** para backend
- **Conventional Commits** para mensajes
- **ESLint + Prettier** para formateo
- **Tests unitarios** requeridos

---

## 📄 **LICENCIA**

Este proyecto está bajo la **Licencia MIT** - ver el archivo [LICENSE](LICENSE) para detalles.

---

## 📞 **SOPORTE**

### **Documentación**
- **API Docs**: http://localhost:8090/swagger-ui.html
- **Guías**: Carpeta `/docs`
- **Scripts**: Archivos `.ps1` en la raíz

### **Contacto**
- **Email**: support@magicsmartkids.com
- **Issues**: [GitHub Issues](https://github.com/magicsmartkids/platform/issues)
- **Website**: https://magicsmartkids.com

---

## 👥 **AUTORES**

- **Valentina IT Dev** - [ValentinaITDev](https://github.com/ValentinaITDev)
- **DanielR** - [DanielR](https://github.com/Daniel00112113)

---

## 🙏 **AGRADECIMIENTOS**

- Spring Boot community
- React community
- Tailwind CSS
- Todos los contribuidores del proyecto

---

## ✨ **¡GRACIAS POR USAR MAGICSMARTKIDS!**

**Una plataforma educativa mágica que transforma el aprendizaje en una experiencia divertida e interactiva para niños.** 🎩🌟

---

*"Aprender nunca fue tan mágico"* ✨