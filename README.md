# API de Usuarios de GlobalThink

Este proyecto es una API de gestión de usuarios construida con Node.js y TypeScript. Permite realizar operaciones CRUD básicas en un conjunto de datos de usuarios.

## Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:
- Node.js (versión 14 o superior)
- npm (viene con Node.js)
- Docker (opcional, para ejecución en contenedores)

## Instalación

Clona el repositorio y navega al directorio del proyecto:

```bash
git clone https://github.com/fabriconiglio/API-REST-de-Usuarios
cd globalThink
```

Instala las dependencias del proyecto:

`npm install`

## Compilación

Para compilar el código TypeScript a JavaScript ejecutable, corre:

`npm run build`

Esto generará los archivos compilados en el directorio `dist/`.

## Ejecución

Para iniciar la aplicación en modo de desarrollo, ejecuta:

`npm run dev`

Esto iniciará el servidor con `nodemon`, que se reinicia automáticamente al realizar cambios en los archivos del código fuente.

Para iniciar el servidor en modo de producción, primero asegúrate de construir el proyecto y luego ejecuta:

`npm start`

## Docker

Para construir la imagen Docker del proyecto y ejecutarla, usa los siguientes comandos:

```bash
docker build -t globalthink-api .
docker run -p 3000:3000 globalthink-api
```

## API Endpoints

La API soporta las siguientes operaciones CRUD:

- `POST /users`: Crea un nuevo usuario.
- `GET /users`: Obtiene la lista de todos los usuarios.
- `GET /users/:id`: Obtiene los detalles de un usuario específico.
- `PUT /users/:id`: Actualiza la información de un usuario existente.
- `DELETE /users/:id`: Elimina un usuario existente.

## Pruebas

Para ejecutar las pruebas unitarias definidas en el proyecto, utiliza:

`npm test`

Esto ejecutará todas las pruebas y proporcionará un reporte de los resultados.

## Documentación de la API

Para acceder a la documentación interactiva de Swagger, inicia el servidor y navega a `http://localhost:3000/api-docs`.

## Contribución

Si deseas contribuir a este proyecto, por favor considera las siguientes pautas:
- Haz un fork del repositorio.
- Crea una rama para tu característica o corrección.
- Escribe código limpio y autodocumentado.
- Asegúrate de incluir pruebas relevantes.
- Abre un Pull Request con una descripción clara de tus cambios.

## Licencia

Este proyecto está licenciado bajo la Licencia MIT - ver el archivo `LICENSE` para más detalles.




