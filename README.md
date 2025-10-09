 🐾 FurbitAll - BackEnd

FurbitAll es una plataforma de adopción y gestión de mascotas desarrollada con Node.js y Express.  
Este repositorio contiene la API y lógica del lado del servidor para el proyecto **FurbitAll**, que se conecta con el frontend desplegado en Netlify.

---

## 🚀 Tecnologías Utilizadas

- **Node.js**
- **Express.js**
- **MongoDB (Mongoose)**
- **JWT (Json Web Token)**
- **bcryptjs**
- **CORS**
- **dotenv**

---

## 🧩 Estructura del Proyecto

```
FurbitAll-BackEnd/
├── controllers/       # Lógica principal de cada ruta
├── middlewares/       # Autenticación y validaciones
├── models/            # Esquemas de MongoDB
├── routes/            # Endpoints del servidor
├── .env.example       # Variables de entorno de ejemplo
├── server.js          # Punto de entrada principal
└── package.json
```

---

## ⚙️ Instalación y Configuración

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/tuusuario/FurbitAll-BackEnd.git
   cd FurbitAll-BackEnd
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   Crea un archivo `.env` en la raíz del proyecto con el siguiente contenido:

   ```env
   PORT=5000
   MONGODB_URI=tu_cadena_de_conexion_a_mongo
   JWT_SECRET=tu_clave_secreta
   FRONTEND_URL=https://furbitall.netlify.app
   ```

4. **Iniciar el servidor en desarrollo**
   ```bash
   npm run dev
   ```

5. **Servidor en producción**
   ```bash
   npm start
   ```

---

## 🔐 Rutas Principales

| Método | Endpoint | Descripción |
|--------|-----------|--------------|
| GET | `/api/ads` | Obtener todos los anuncios |
| POST | `/api/ads` | Crear nuevo anuncio (admin) |
| GET | `/api/users` | Obtener todos los usuarios (admin) |
| POST | `/api/auth/register` | Registrar usuario |
| POST | `/api/auth/login` | Iniciar sesión |

---

## ✅ Validaciones

El backend incluye middleware para verificar:
- Tokens JWT
- Roles de usuario (admin)
- Validaciones de formularios en endpoints críticos

---

## 🧪 Pruebas Locales

Puedes probar la API usando **Postman** o **Thunder Client**.

Ejemplo:
```bash
GET http://localhost:5000/api/ads
```

---

## 🌐 Deploy

- **Frontend:** [Netlify](https://furbitall.netlify.app)
- **Backend:** [Render](https://render.com)

---

## 👥 Autor

**José Manuel Carrasco Rivero**  
💼 Desarrollador Full Stack  
📧 [Tu correo de contacto]  
🌐 [Tu perfil de GitHub o LinkedIn]
