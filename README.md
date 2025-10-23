# 🐾 FurbitAll - Backend

## 📌 Descripción
**FurbitAll** es una plataforma MERN desarrollada para la gestión y reserva de productos y canchas deportivas.  
El backend provee una API REST segura, escalable y totalmente funcional, que gestiona usuarios, autenticación, productos, canchas, reservas y anuncios publicitarios.

Este proyecto forma parte del **Proyecto Final RAFA (RollingCode School)** y ha sido diseñado con **buenas prácticas, validaciones, seguridad JWT y un flujo CRUD completo.**

---

## ⚙️ Tecnologías y Dependencias Principales

- **Node.js** + **Express.js** → Servidor y rutas
- **MongoDB** + **Mongoose** → Base de datos y modelos
- **JWT** + **bcryptjs** → Autenticación y cifrado
- **CORS** → Configuración dinámica mediante variables de entorno
- **Dotenv** → Manejo seguro de variables de entorno
- **Validator / Joi** → Validaciones de datos en el backend
- **Nodemon** → Desarrollo en caliente (dev)

---

## 📁 Estructura del Proyecto

FurbitAll-BackEnd/
│
├── controllers/ # Controladores para cada recurso (products, fields, ads, bookings, users)
├── models/ # Modelos Mongoose
├── routes/ # Rutas organizadas por entidad
├── middlewares/ # Auth, validaciones, manejo de errores
├── utils/ # Funciones auxiliares
├── .env.example # Variables de entorno de ejemplo
├── server.js # Configuración del servidor Express
└── package.json


---

## 🔐 Autenticación y Roles

- Sistema de **login y registro con JWT**.
- Middleware `verifyToken` para proteger rutas privadas.
- Middleware `checkAdmin` para limitar el acceso de administración.
- Rutas seguras para creación, edición y eliminación de datos.

---

## 🧩 Endpoints Principales

### 🛍️ Productos (`/api/products`)
- `GET /` → Obtener todos los productos
- `GET /:id` → Obtener producto por ID
- `POST /` → Crear producto *(solo admin)*
- `PATCH /:id` → Editar producto *(solo admin)*
- `PATCH /stock/bulk` → Actualizar stock masivamente *(solo admin)*
- `DELETE /:id` → Eliminar producto *(solo admin)*

### ⚽ Canchas (`/api/fields`)
- `GET /` → Obtener todas las canchas
- `POST /` → Crear cancha *(solo admin)*
- `PATCH /:id` → Editar cancha *(solo admin)*
- `DELETE /:id` → Eliminar cancha *(solo admin)*

### 📅 Reservas (`/api/bookings`)
- `GET /` → Obtener todas las reservas
- `POST /` → Crear reserva (con validación de disponibilidad)
- `DELETE /:id` → Cancelar reserva

### 📢 Anuncios (`/api/ads`)
- `GET /` → Listado público de anuncios
- `GET /admin` → Listado completo *(solo admin)*
- `POST /` → Crear anuncio *(solo admin)*
- `PATCH /:id` → Editar anuncio *(solo admin)*
- `DELETE /:id` → Eliminar anuncio *(solo admin)*

---

## 🧠 Validaciones

- Validación de precios, stock y URLs correctas.
- `precio >= 0`, `stock >= 0` obligatorio.
- Validación de disponibilidad antes de crear reservas.
- Manejo de errores `401`, `403`, `404` y `409`.

---

## 🌐 CORS y Variables de Entorno

CORS configurado dinámicamente con `.env`:
```env
PORT=4000
MONGO_URI=mongodb+srv://...
JWT_SECRET=tu_secreto_jwt
CORS_ORIGIN=https://tu-frontend.netlify.app

## 🚀 Deploy

- **Backend:** [Render](https://render.com) o [Railway](https://railway.app)  
- **Base de datos:** [MongoDB Atlas](https://www.mongodb.com/atlas)  
- **Frontend:** [Netlify](https://www.netlify.com) o [Vercel](https://vercel.com)

### 🔧 Pasos básicos de despliegue

1. **Sube el repositorio** a GitHub.
2. **Crea un nuevo servicio** en Render o Railway.
3. **Configura las variables de entorno** en la plataforma (usa las mismas del archivo `.env`).
4. **Conecta el repositorio** de GitHub y habilita el deploy automático.
5. **Verifica las rutas** con herramientas como Postman o Thunder Client.
6. **Actualiza la variable `CORS_ORIGIN`** con el dominio del frontend (Netlify o Vercel).

---

## 🧪 QA y Seguridad

- Manejo detallado de errores con códigos `401`, `403`, `404` y `409`.  
- Validaciones de datos en todos los endpoints.  
- Tokens JWT con expiración y protección de rutas.  
- Sanitización de entradas para evitar inyecciones.  
- CORS configurado mediante `.env` para restringir orígenes en producción.  
- Tests manuales realizados desde el frontend FurbitAll para verificar flujo de checkout, stock y reservas.

---

## 🧰 Scripts disponibles

```bash
# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev

# Ejecutar en producción
npm start
🤝 Autor

Jose Manuel Carrasco Rivero
Full Stack Developer certificado por RollingCode School
📍 Experiencia internacional (Europa y Oceanía)
🌎 Enfoque en desarrollo web, escalabilidad y usabilidad.
