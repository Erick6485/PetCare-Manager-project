# PetCare Manager

> **Sistema de gestión integral para spas y peluquerías de mascotas**

![Estado](https://img.shields.io/badge/estado-en%20desarrollo-yellow)
![Java](https://img.shields.io/badge/Java-21-orange)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.3.0-brightgreen)
![React](https://img.shields.io/badge/React-19-blue)

---

## Descripción General

**PetCare Manager** es una aplicación web diseñada para digitalizar y optimizar la operación diaria de un spa o peluquería de mascotas. Permite gestionar clientes, mascotas, servicios y citas en un solo lugar, con control de acceso diferenciado por rol: **Administrador**, **Recepcionista** y **Peluquero**. Cada usuario ve únicamente lo que necesita para hacer su trabajo, eliminando confusión y reduciendo errores operativos. El sistema garantiza trazabilidad completa mediante una bitácora automática de todos los cambios de estado de las atenciones.

---

## Características Principales

- **Autenticación segura con JWT** — sesiones de 30 minutos con tokens firmados y cierre automático al expirar.
- **Control de acceso por rol (RBAC)** — tres perfiles con vistas y permisos completamente independientes.
- **Gestión de atenciones con máquina de estados** — flujo controlado `PENDIENTE → EN_PROCESO → FINALIZADO / CANCELADO`.
- **Límite de carga laboral por peluquero** — el sistema impide asignar más de 3 servicios simultáneos al mismo peluquero en la misma franja horaria.
- **Subida de evidencias fotográficas** — imágenes `ANTES` y `DESPUÉS` por atención (JPEG/PNG, máx. 5 MB).
- **Bitácora automática de cambios** — cada transición de estado queda registrada con usuario, fecha y hora exacta.
- **Filtrado visual por estado** — tarjetas interactivas para filtrar atenciones por `Pendientes`, `En proceso`, `Finalizados` y `Cancelados`.
- **Diseño responsivo** — adaptado para uso en escritorio, tablet y celular dentro del spa.
- **API REST** — endpoints claros y consistentes bajo el prefijo `/api/`, protegidos con Spring Security.

---

## Arquitectura y Tecnologías Usadas

El proyecto sigue una arquitectura **cliente-servidor desacoplada**. El **backend** expone una API REST que el **frontend** consume mediante Axios con interceptores JWT. La base de datos es gestionada exclusivamente a través de **migraciones versionadas con Flyway**, lo que garantiza consistencia entre entornos de desarrollo y producción.

```
[ React SPA ] ──── HTTP/JSON + JWT ────> [ Spring Boot REST API ] ──── JPA/Hibernate ────> [ PostgreSQL ]
   :5173                                        :8080                                           :5432
```

### **Tabla de Tecnologías**

| Capa | Tecnología | Versión | Propósito |
|---|---|---|---|
| **Frontend** | React | 19.x | Interfaz de usuario (SPA) |
| **Frontend** | React Router DOM | 7.x | Enrutamiento y protección de rutas por rol |
| **Frontend** | Axios | 1.x | Cliente HTTP con interceptores JWT automáticos |
| **Frontend** | Vite | 8.x | Herramienta de construcción y servidor de desarrollo |
| **Backend** | Java | 21 | Lenguaje del servidor |
| **Backend** | Spring Boot | 3.3.0 | Framework principal de la API REST |
| **Backend** | Spring Security | 6.x | Autenticación, autorización y filtros JWT |
| **Backend** | Spring Data JPA | 3.3.0 | ORM y acceso a datos con Hibernate |
| **Backend** | jjwt | 0.12.6 | Generación y validación de tokens JWT (HMAC) |
| **Backend** | Flyway | 10.x | Migraciones versionadas de base de datos |
| **Backend** | Lombok | 1.18.46 | Reducción de código boilerplate |
| **Base de datos** | PostgreSQL | 15+ | Motor de base de datos relacional |

---

## Estructura del Proyecto

```plaintext
PetCare-Manager-project/
│
├── backend/                             ← API REST (Spring Boot)
│   ├── pom.xml                          ← Dependencias y plugins Maven
│   └── src/main/
│       ├── java/com/petcare/
│       │   ├── PetcareBackendApplication.java
│       │   ├── config/                  ← Seguridad, JWT, CORS y constantes
│       │   │   ├── AppConstants.java    ← Límites del sistema (carga, tamaño, JWT)
│       │   │   ├── CorsConfig.java      ← Permite peticiones desde localhost:5173
│       │   │   ├── JwtService.java      ← Generación y validación de tokens
│       │   │   ├── JwtAuthenticationFilter.java
│       │   │   └── SecurityConfig.java  ← Rutas públicas vs. protegidas
│       │   ├── controllers/             ← Endpoints REST bajo /api/*
│       │   │   ├── AuthController.java  ← POST /api/auth/login
│       │   │   ├── AtencionController.java
│       │   │   ├── ClienteController.java
│       │   │   ├── EvidenciaController.java
│       │   │   ├── MascotaController.java
│       │   │   ├── ServicioController.java
│       │   │   └── UsuarioController.java
│       │   ├── dto/                     ← Objetos de transferencia de datos (entrada/salida)
│       │   ├── models/                  ← Entidades JPA mapeadas a tablas de BD
│       │   ├── repositories/            ← Interfaces JpaRepository con consultas custom
│       │   ├── security/                ← PetcarePrincipal y SecurityUtils
│       │   └── services/                ← Toda la lógica de negocio
│       └── resources/
│           ├── application.properties   ← Configurar antes de ejecutar
│           └── db/
│               ├── migration/           ← V1–V7: migraciones Flyway (no modificar)
│               └── seed/                ← R__datos_iniciales.sql (roles + admin)
│
├── frontend/                            ← SPA (React + Vite)
│   ├── package.json
│   ├── vite.config.js
│   └── src/
│       ├── context/
│       │   └── AuthContext.jsx          ← Estado global: token, usuario, rol, login/logout
│       ├── components/common/
│       │   ├── Layout.jsx               ← Topbar + área de contenido principal
│       │   ├── Sidebar.jsx              ← Navegación filtrada por rol + cerrar sesión
│       │   ├── Modal.jsx                ← Modal reutilizable para formularios
│       │   └── PrivateRoute.jsx         ← Redirige si no hay sesión o rol no permitido
│       ├── pages/
│       │   ├── LoginPage.jsx            ← Autenticación con toggle contraseña
│       │   ├── DashboardPage.jsx        ← Vista exclusiva ADMINISTRADOR
│       │   ├── RecepcionistaPage.jsx    ← Vista exclusiva RECEPCIONISTA
│       │   ├── PeluqueroPage.jsx        ← Vista exclusiva PELUQUERO (agenda + evidencias)
│       │   ├── ClientesPage.jsx
│       │   ├── MascotasPage.jsx
│       │   ├── AtencionesPage.jsx
│       │   ├── ServiciosPage.jsx
│       │   └── UsuariosPage.jsx         ← Solo accesible para ADMINISTRADOR
│       ├── services/                    ← Un archivo por módulo de la API
│       │   ├── api.js                   ← Instancia Axios con interceptor Bearer + 401
│       │   ├── authService.js
│       │   ├── atencionService.js
│       │   ├── clienteService.js
│       │   ├── evidenciaService.js
│       │   ├── mascotaService.js
│       │   ├── servicioService.js
│       │   └── usuarioService.js
│       ├── App.jsx                      ← Rutas protegidas y asignadas por rol
│       ├── main.jsx                     ← Punto de entrada con AuthProvider
│       └── index.css                    ← Estilos globales con variables CSS
│
└── database/                            ← SQLs de referencia (solo documentación)
    ├── migration/
    └── seed/
```

---

## Requisitos Previos

Asegúrate de tener instalado lo siguiente **antes de comenzar**:

| Herramienta | Versión mínima | Cómo verificar |
|---|---|---|
| **Java JDK** | 21 exactamente | `java -version` |
| **Node.js** | 18.x o superior | `node -v` |
| **npm** | 9.x o superior | `npm -v` |
| **PostgreSQL** | 15.x o superior | `psql --version` |
| **IntelliJ IDEA** | Community o Ultimate | — |

>**Advertencia crítica:** Usa **Java 21 únicamente**. Java 24 o superior causa errores de compilación con Lombok (`TypeTag :: UNKNOWN`). Si IntelliJ detecta una versión incorrecta, ve a `File → Project Structure → SDK` y selecciona o descarga el JDK 21 (recomendado: Eclipse Temurin).

---

## Configuración e Instalación

### **Paso 1 — Clonar el repositorio**

```bash
git clone https://github.com/Erick6485/PetCare-Manager-project.git
cd PetCare-Manager-project
```

### **Paso 2 — Crear la base de datos**

Abre tu cliente PostgreSQL (DBeaver, pgAdmin o psql) y ejecuta:

```sql
CREATE DATABASE petcare_db;
```

### **Paso 3 — Configurar el backend**

Abre `backend/src/main/resources/application.properties` y edita estos valores con los de tu entorno local:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/petcare_db
spring.datasource.username=postgres
spring.datasource.password=TU_CONTRASENA_AQUI

jwt.secret=TU_CLAVE_SECRETA_MINIMO_32_CARACTERES_AQUI
jwt.expiration-ms=1800000

petcare.uploads-dir=uploads
```

### **Paso 4 — Ejecutar el backend**

> **Las migraciones de base de datos se aplican automáticamente.** Flyway crea todas las tablas y carga los datos iniciales la primera vez que el servidor arranca. No necesitas ejecutar ningún SQL manualmente.

```bash
cd backend
./mvnw spring-boot:run
```

En **Windows**:

```bash
cd backend
mvnw.cmd spring-boot:run
```

El servidor está listo cuando la consola muestra:

```
Flyway: Successfully applied X migrations
Started PetcareBackendApplication in X seconds
Tomcat started on port(s): 8080
```

Verifica en el navegador: `http://localhost:8080/api/usuarios` debe retornar el usuario administrador en JSON.

### **Paso 5 — Instalar dependencias del frontend**

```bash
cd ../frontend
npm install
```

### **Paso 6 — Ejecutar el frontend**

```bash
npm run dev
```

El servidor de desarrollo estará disponible en:

```
http://localhost:5173
```

> El **backend debe estar corriendo al mismo tiempo** que el frontend. El frontend consume la API en `localhost:8080`.

### **Paso 7 — Iniciar sesión**

Abre el navegador en `http://localhost:5173` y usa una de estas credenciales de prueba:

| Usuario | Contraseña | Rol | Vista inicial |
|---|---|---|---|
| `admin` | `Admin2025*` | Administrador | Dashboard general |
| `peluquero` | `Admin2025*` | Peluquero | Mi Agenda |

> Para crear un usuario **Recepcionista**, inicia sesión como `admin` y ve a la sección **Usuarios → Nuevo usuario**.

---

## Variables de Entorno

Todas las variables se configuran en `backend/src/main/resources/application.properties`.

| Variable | Descripción | Ejemplo | Obligatoria |
|---|---|---|---|
| `spring.datasource.url` | URL de conexión a PostgreSQL | `jdbc:postgresql://localhost:5432/petcare_db` | Sí |
| `spring.datasource.username` | Usuario de PostgreSQL | `postgres` | Sí |
| `spring.datasource.password` | Contraseña de PostgreSQL | `mi_contrasena_segura` | Sí |
| `jwt.secret` | Clave para firmar tokens JWT (mín. 32 caracteres) | `petcare-secret-key-desarrollo-2025` | Sí |
| `jwt.expiration-ms` | Tiempo de vida del token en milisegundos | `1800000` (30 min) | Sí |
| `petcare.uploads-dir` | Ruta donde se almacenan las evidencias fotográficas | `uploads` | Sí |
| `spring.servlet.multipart.max-file-size` | Tamaño máximo por imagen subida | `5MB` | Opcional |
| `spring.servlet.multipart.max-request-size` | Tamaño máximo total de la petición multipart | `10MB` | Opcional |
| `spring.jpa.show-sql` | Imprime las consultas SQL en consola | `false` | Opcional |
| `spring.jpa.hibernate.ddl-auto` | Estrategia de Hibernate (usar `validate` con Flyway) | `validate` | Sí |

> **Seguridad:** Nunca subas `application.properties` con credenciales reales a un repositorio público. En producción, reemplaza los valores sensibles con variables de entorno del sistema operativo.