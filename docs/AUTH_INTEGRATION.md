# Documentación: Integración Frontend-Backend TalentApp

## Arquitectura

```
┌─────────────────┐         ┌─────────────────┐         ┌─────────────────┐
│    Frontend     │  HTTP   │     Backend     │         │   PostgreSQL    │
│  React + Vite   │ ──────► │     NestJS      │ ──────► │    Database     │
│  localhost:5173 │         │  localhost:3000 │         │  localhost:5433 │
└─────────────────┘         └─────────────────┘         └─────────────────┘
```

---

## Endpoints de Autenticación

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| POST | `/auth/login` | Iniciar sesión | No |
| POST | `/auth/logout` | Cerrar sesión | Sí |
| GET | `/auth/me` | Obtener usuario actual | Sí |

---

## Flujo de Autenticación

```
1. LOGIN
   Usuario → POST /auth/login {email, password}
           ← {accessToken, refreshToken, user}
           → Guarda tokens en localStorage

2. PETICIONES AUTENTICADAS
   Usuario → GET /auth/me
           → Header: Authorization: Bearer <accessToken>
           ← {user data}

3. LOGOUT
   Usuario → POST /auth/logout
           → Limpia localStorage
           → Redirige a /login
```

---

## Archivos Clave

### Frontend (`frontend-talentapp-Alberto/`)

| Archivo | Función |
|---------|---------|
| `src/services/apiClient.js` | Cliente Axios con interceptores |
| `src/services/authService.js` | Funciones de autenticación |
| `src/services/storageService.js` | Manejo de localStorage |
| `.env` | `VITE_API_URL=http://localhost:3000` |

### Backend (`backend-talentapp_Alberto/talentapp/`)

| Archivo | Función |
|---------|---------|
| `src/main.ts` | CORS habilitado |
| `src/auth/auth.controller.ts` | Endpoints de auth |
| `src/auth/auth.service.ts` | Lógica de autenticación |

---

## Configuración de CORS (Backend)

```typescript
// src/main.ts
app.enableCors({
  origin: ['http://localhost:5173', 'http://localhost:3001'],
  credentials: true,
});
```

---

## Cliente API (Frontend)

```javascript
// src/services/apiClient.js
import axios from 'axios';
import { storageService } from './storageService';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Agrega token a cada request
apiClient.interceptors.request.use((config) => {
  const token = storageService.getItem(storageService.KEYS.AUTH_TOKEN);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Redirige a login si recibe 401
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      storageService.clearAll();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

---

## Storage Keys

```javascript
const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',      // JWT access token
  REFRESH_TOKEN: 'refresh_token', // Refresh token
  USER: 'user',                   // Datos del usuario
};
```

---

## Iniciar con Docker

```bash
# 1. Backend (en backend-talentapp_Alberto/talentapp/)
docker-compose up -d

# 2. Frontend (en frontend-talentapp-Alberto/)
docker-compose up dev

# Si agregas dependencias npm al frontend:
docker exec talentapp-frontend-dev npm install <paquete>
```

---

## Credenciales de Prueba

| Campo | Valor |
|-------|-------|
| Email | `admin@talentapp.com` |
| Password | `Ch4ng3M3!` |

---

## Respuesta del Login

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "b2d8f514-2505-40bf-...",
  "user": {
    "id": "a4ba3a29-0079-450d-...",
    "email": "admin@talentapp.com",
    "firstName": "System",
    "lastName": "Administrator",
    "role": {
      "code": "admin",
      "name": "Administrator"
    },
    "department": null,
    "status": "active"
  }
}
```

---

## Uso en Componentes

```javascript
import { authService } from '../services';

// Login
const result = await authService.login({ email, password });
if (result.success) {
  // Redirigir a dashboard
}

// Obtener usuario actual (síncrono, desde localStorage)
const user = authService.getCurrentUserSync();

// Logout
await authService.logout();
```

---

## Troubleshooting

### El login falla con "Invalid credentials"
- Verifica que el backend esté corriendo: `docker ps`
- Verifica las credenciales en la base de datos

### Error de CORS
- Asegúrate de que el backend tenga CORS habilitado
- Reconstruye el contenedor: `docker-compose up -d --build app`

### Axios no encontrado en Docker
- Instala dentro del contenedor: `docker exec talentapp-frontend-dev npm install axios`

### El botón de logout no funciona
- Verifica que el z-index del overlay sea menor que el del menú
