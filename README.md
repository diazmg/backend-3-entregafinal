# Proyecto Final — Backend III | Coderhouse

API REST para gestión de adopciones de mascotas. Proyecto final del curso Backend III del programa Full Stack Developer de Coderhouse.

---

## Estructura del proyecto

```
adoption-project/
├── src/
│   ├── app.js                        # Entry point de la aplicación
│   ├── routes/
│   │   └── adoption.router.js        # Router principal con los 3 endpoints
│   ├── services/
│   │   └── adoptions.service.js      # Lógica de negocio de adopciones
│   ├── dao/
│   │   └── mongo/
│   │       ├── genericDao.js         # DAO genérico (CRUD base)
│   │       └── daos.js               # DAOs específicos: Users, Pets, Adoptions
│   └── models/
│       ├── User.js                   # Modelo Mongoose de Usuario
│       ├── Pet.js                    # Modelo Mongoose de Mascota
│       └── Adoption.js               # Modelo Mongoose de Adopción
├── test/
│   └── adoption.test.js              # Tests funcionales con Mocha + Supertest
├── Dockerfile                        # Imagen Docker optimizada (multi-stage)
├── .dockerignore
├── .env                              # Variables de entorno (no subir a git)
├── .gitignore
├── .mocharc.cjs                      # Configuración de Mocha
└── package.json
```

---

## Endpoints disponibles

| Método | Ruta                          | Descripción                        |
|--------|-------------------------------|------------------------------------|
| GET    | `/api/adoptions`              | Obtiene todas las adopciones       |
| GET    | `/api/adoptions/:aid`         | Obtiene una adopción por ID        |
| POST   | `/api/adoptions/:uid/:pid`    | Crea una adopción (usuario + mascota) |

---

## Correr los tests

```bash
# Instalar dependencias
npm install

# Ejecutar todos los tests
npm test

# O directamente con mocha
NODE_ENV=test npx mocha test/adoption.test.js --exit
```

**Los tests no requieren MongoDB.** Usan handlers mockeados con `supertest` y Express para aislar completamente la lógica de transporte HTTP.

---

## Construir y ejecutar con Docker

### 1. Construir la imagen

```bash
docker build -t tu-usuario/adoption-api:latest .
```

### 2. Ejecutar el contenedor

```bash
docker run -d \
  -p 8080:8080 \
  -e MONGO_URI=mongodb://host.docker.internal:27017/adoptions \
  -e NODE_ENV=production \
  --name adoption-api \
  tu-usuario/adoption-api:latest
```

### 3. Verificar que está corriendo

```bash
docker ps
curl http://localhost:8080/
```

### 4. Ver logs

```bash
docker logs adoption-api
```

---

## Subir imagen a DockerHub

```bash
# Login
docker login

# Tag
docker tag adoption-api:latest tu-usuario/adoption-api:latest

# Push
docker push tu-usuario/adoption-api:latest
```

**Imagen pública:** `https://hub.docker.com/r/tu-usuario/adoption-api`

---

## Variables de entorno

| Variable    | Descripción                        | Default                                   |
|-------------|------------------------------------|-------------------------------------------|
| `PORT`      | Puerto donde corre el servidor     | `8080`                                    |
| `MONGO_URI` | Cadena de conexión a MongoDB       | `mongodb://localhost:27017/adoptions`     |
| `NODE_ENV`  | Entorno de ejecución               | `development`                             |

---

## Tecnologías

- **Node.js** v20
- **Express** v4
- **Mongoose** v8
- **Mocha** + **Chai** + **Supertest** (testing)
- **Docker** (multi-stage build con node:20-alpine)
