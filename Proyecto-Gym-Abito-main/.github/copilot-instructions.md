## Instrucciones para agentes AI (proyecto Gym Abito)

Breve: este repo es una SPA en Vue 3 (CLI) que consume una API separada (dev en http://localhost:8000 por defecto). Aquí están los patrones y atajos que un agente debe conocer para ser productivo inmediatamente.

- Tecnologías clave: Vue 3, vue-router 4, Axios, Bootstrap, Chart.js. Entradas importantes:
  - `package.json` (scripts: `npm install`, `npm run serve`, `npm run build`).
  - `src/main.js` carga estilos globales (`src/assets/style.css`), Bootstrap y FontAwesome.

- Arquitectura y flujo de datos:
  - Frontend (esta app) <-> Backend API (repo separado). Base URL definida en `src/api/index.js` como `API_BASE_URL` (`http://localhost:8000`).
  - Todas las llamadas HTTP usan la instancia `apiClient` exportada por `src/api/index.js`. Ejemplo de uso en servicios: `import apiClient from '@/api'` y luego `apiClient.get('/ruta')`.
  - `apiClient` incluye un interceptor que añade el token (desde `src/api/storage/userStorage.js`) y ajusta `Content-Type` para el login (`/auth/login` -> `application/x-www-form-urlencoded`). No dupliques lógica de auth en los servicios.

- Estructura y convenciones del código:
  - Servicios API: `src/api/services/*.js` (ej.: `alumnoService.js`, `authService.js`, etc.). Cada servicio debe usar `apiClient` y exportar funciones por entidad.
  - Storage de usuario/Token: `src/api/storage/userStorage.js` — funciones usadas por router y apiClient: `getToken()`, `getUser()`.
  - Rutas y guards: `src/router/index.js` — uso de `meta.requiresAuth` y `meta.isAdmin`. El guard global redirige según `getToken()` y `getUser().esAdmin`.
  - Componentes: organizados por dominio en `src/components/` (p. ej. `Administracion`, `DashBoard`, `Inicio`). Componentes de administrador y usuario están separados bajo `Administracion/Admin` y `Administracion/Usuario`.

- Patrones importantes y ejemplos concretos:
  - Añadir una nueva llamada API: crear/actualizar `src/api/services/<entidad>Service.js` y usar:

    import apiClient from '@/api'

    export function listar() {
      return apiClient.get('/entidad')
    }

  - Autenticación: `authService.js` debe enviar credenciales a `/auth/login`. Nota: `apiClient` cambia `Content-Type` para este endpoint.
  - Guardas de rutas: si una vista necesita rol admin, añadir `meta: { requiresAuth: true, isAdmin: true }` (ver `src/router/index.js`).

- Flujo de desarrollo y comandos:
  - Instalación: `npm install`
  - Desarrollo local: `npm run serve` (dev server con hot-reload)
  - Build producción: `npm run build`
  - Backend: repo separado (ruta local mencionada en README); en desarrollo activa el virtualenv del backend y ejecuta `py main.py` desde su carpeta `src`.

- Convenciones de estilo y riesgos a evitar:
  - Evitar hardcodear la URL base: use `API_BASE_URL` en `src/api/index.js`.
  - No modificar el interceptor de `apiClient` sin comprender el manejo del token y el caso especial de `/auth/login`.
  - Mantener la separación UI <-> services. Los componentes consumen servicios, no axios directo (salvo casos justificados).

- Archivos clave para referencia rápida:
  - `src/api/index.js`  (axios + interceptor, API_BASE_URL)
  - `src/api/storage/userStorage.js` (getToken/getUser)
  - `src/api/services/*.js` (puntos de entrada para llamadas a la API por entidad)
  - `src/router/index.js` (guards y rutas protegidas)
  - `src/main.js` (puntos de montaje y estilos globales)

Si algo en estas secciones parece incompleto o hay reglas que quieras reforzar (nombres de endpoints, convenciones de commits, pipeline CI), dime y lo iteramos.
