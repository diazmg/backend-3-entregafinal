# ── Etapa 1: build / instalación de dependencias ──────────────
FROM node:20-alpine AS deps

WORKDIR /app

# Copiar solo los manifests primero (aprovecha cache de Docker)
COPY package*.json ./

# Instalar solo dependencias de producción
RUN npm ci --omit=dev

# ── Etapa 2: imagen final ──────────────────────────────────────
FROM node:20-alpine

# Crear usuario no-root por seguridad
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

WORKDIR /app

# Copiar dependencias ya instaladas desde etapa anterior
COPY --from=deps /app/node_modules ./node_modules

# Copiar código fuente
COPY src/ ./src/
COPY package.json ./

# Cambiar al usuario no-root
USER appuser

# Exponer puerto
EXPOSE 8080

# Variable de entorno por defecto
ENV NODE_ENV=production
ENV PORT=8080

# Comando de inicio
CMD ["node", "src/app.js"]
