FurbitAll – Backend
Proyecto MERN para gestión de productos, canchas, reservas y publicidad.
Backend completo construido con Node.js, Express y MongoDB, con autenticación JWT/Bcrypt, middlewares de seguridad, validaciones complejas y endpoints optimizados para integrarse con el frontend React-Bootstrap del proyecto.

📌 Características principales:

- API REST completa con Node.js + Express
- MongoDB/Mongoose como base de datos
- Autenticación segura con JWT y bcrypt
- Middlewares para autenticación y roles (Admin)
- CRUD de:

Productos
Canchas
Reservas (con validaciones complejas)
Publicidad (Ads)

- Validaciones de reservas:

Máximo 3 reservas por día
Sin fechas pasadas
Sin solapamientos (30/60 min)
Actualización/cancelación con control

- Endpoint especial de manejo de stock:
PATCH /products/stock/bulk

- CORS abierto en desarrollo (pendiente limitar en producción)

🧱 Tecnologías utilizadas
- Node.js
- Express
- MongoDB + Mongoose
- JSON Web Tokens (JWT)
- bcrypt
- dotenv
- Cors
- Nodemon (dev)

📂 Estructura del proyecto
backend/
 ├─ controllers/
 │   ├─ authController.js
 │   ├─ productsController.js
 │   ├─ fieldsController.js
 │   ├─ reservasController.js
 │   └─ adsController.js
 ├─ models/
 │   ├─ User.js
 │   ├─ Product.js
 │   ├─ Field.js
 │   ├─ Reserva.js
 │   └─ Ad.js
 ├─ routes/
 │   ├─ authRoutes.js
 │   ├─ productRoutes.js
 │   ├─ fieldRoutes.js
 │   ├─ reservaRoutes.js
 │   └─ adsRoutes.js
 ├─ middlewares/
 │   ├─ auth.js
 │   └─ isAdmin.js
 ├─ config/
 │   └─ db.js
 ├─ utils/
 │   └─ validations.js
 ├─ server.js
 └─ .env


🔐 Autenticación

El backend utiliza JWT para gestionar sesiones seguras.

✔ Registro
POST /auth/register

✔ Login
POST /auth/login

Respuesta:
- token JWT
- datos básicos del usuario
- rol para permitir navegación admin/usuario

Middlewares
- auth → verifica el token
- isAdmin → acceso exclusivo para administradores
# 🎾 Endpoints principales

## 🛍️ Productos

| Método | Ruta | Protegida | Descripción |
|--------|-------|------------|-------------|
| GET | `/products` | ❌ | Listar productos |
| GET | `/products/:id` | ❌ | Obtener un producto |
| POST | `/products` | ✔ Admin | Crear |
| PUT | `/products/:id` | ✔ Admin | Editar |
| DELETE | `/products/:id` | ✔ Admin | Eliminar |
| PATCH | `/products/stock/bulk` | ❌ (since checkout) | Actualizar stock de varios productos |

---

## 🏟️ Canchas

| Método | Ruta | Protegida | Descripción |
|--------|-------|------------|-------------|
| GET | `/fields` | ❌ | Listar canchas |
| GET | `/fields/:id` | ❌ | Obtener una cancha |
| POST | `/fields` | ✔ Admin | Crear |
| PUT | `/fields/:id` | ✔ Admin | Editar |
| DELETE | `/fields/:id` | ✔ Admin | Eliminar |

---

## 📅 Reservas

Sistema con lógica compleja:

- ✔ Máx 3 reservas por día  
- ✔ Sin solapamientos  
- ✔ Sin reservas pasadas  
- ✔ Cancelación y edición controladas  

| Método | Ruta | Protegida | Descripción |
|--------|-------|------------|-------------|
| GET | `/reservas` | ✔ Admin | Todas |
| GET | `/reservas/user/:id` | ✔ | Reservas del usuario |
| POST | `/reservas` | ✔ | Crear reserva |
| PUT | `/reservas/:id` | ✔ | Editar reserva |
| DELETE | `/reservas/:id` | ✔ | Cancelar |

---

## 📢 Ads

| Método | Ruta | Protegida | Descripción |
|--------|-------|------------|-------------|
| GET | `/ads` | ❌ | Mostrar publicidad |
| POST | `/ads` | ✔ Admin | Crear |
| PUT | `/ads/:id` | ✔ Admin | Editar |
| DELETE | `/ads/:id` | ✔ Admin | Eliminar |

---

# ⚙️ Instalación

```bash
git clone https://github.com/tuusuario/furbitall-backend.git
cd furbitall-backend
npm install

▶️ Modo desarrollo
npm run dev

🚀 Modo producción
npm start

📄 Licencia

MIT License.
Autor: José Manuel Carrasco Rivero
