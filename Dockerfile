# Elegir una imagen base
FROM node:14-alpine

# Establecer el directorio de trabajo en el contenedor
WORKDIR /usr/src/app

# Copiar archivos de definición de paquetes primero para aprovechar la caché de Docker
COPY package*.json ./

# Instalar dependencias del proyecto
RUN npm install

# Copiar el resto del código fuente
COPY . .

# Compilar el código TypeScript
RUN npm run build

# Exponer el puerto que tu aplicación utiliza
EXPOSE 3000

# Comando para ejecutar la aplicación
CMD ["node", "dist/server.js"]