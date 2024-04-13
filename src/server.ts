import express, { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import Joi from 'joi';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';

//Modelos
interface User {
    id: string;
    nombre: string;
    correoElectronico: string;
    edad: number;
}

interface Error {
    status?: number;
    message?: string;
}

let users: User[] = []; // Esto mantendrá nuestros usuarios en la memoria

const app = express();
app.use(express.json()); // Middleware para parsear JSON

// Swagger
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API de Usuarios',
            version: '1.0.0',
            description: 'Esta es una API simple para gestionar usuarios',
        },
        components: {
            schemas: {
                // Esquema para la creación de usuarios
                UserInput: {
                    type: 'object',
                    required: ['nombre', 'correoElectronico', 'edad'],
                    properties: {
                        nombre: {
                            type: 'string',
                            description: 'El nombre del usuario'
                        },
                        correoElectronico: {
                            type: 'string',
                            description: 'El correo electrónico del usuario, debe ser único'
                        },
                        edad: {
                            type: 'integer',
                            description: 'La edad del usuario'
                        }
                    }
                },
                // Esquema para la visualización de usuarios
                User: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'string',
                            description: 'El ID del usuario, generado automáticamente'
                        },
                        nombre: {
                            type: 'string',
                            description: 'El nombre del usuario'
                        },
                        correoElectronico: {
                            type: 'string',
                            description: 'El correo electrónico del usuario, debe ser único'
                        },
                        edad: {
                            type: 'integer',
                            description: 'La edad del usuario'
                        }
                    }
                }
            }
        }
    },
    apis: ['./server.ts'],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Validación de datos
const userSchema = Joi.object({
    nombre: Joi.string().min(3).regex(/^[a-zA-Z\s]+$/).required().messages({
        'string.base': `"nombre" debe ser de tipo texto`,
        'string.empty': `"nombre" no puede estar vacío`,
        'string.min': `"nombre" debe tener al menos 3 caracteres`,
        'string.pattern.base': `"nombre" solo puede contener letras y espacios`,
        'any.required': `"nombre" es un campo requerido`
    }),
    correoElectronico: Joi.string().email().required().messages({
        'string.email': `"correoElectronico" debe ser un correo electrónico válido`,
        'string.empty': `"correoElectronico" no puede estar vacío`,
        'any.required': `"correoElectronico" es un campo requerido`
    }),
    edad: Joi.number().integer().min(0).max(120).required().messages({
        'number.base': `"edad" debe ser un número`,
        'number.integer': `"edad" debe ser un número entero`,
        'number.min': `"edad" debe ser mayor o igual a 0`,
        'number.max': `"edad" debe ser menor o igual a 120`,
        'any.required': `"edad" es un campo requerido`
    })
});

// Rutas

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Crea un nuevo usuario
 *     description: Añade un usuario a la base de datos.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserInput'
 *     responses:
 *       201:
 *         description: Usuario creado exitosamente.
 *       400:
 *         description: Error de validación en los datos de entrada.
 *       409:
 *         description: El correo electrónico ya está en uso.
 */
app.post('/users', (req, res, next) => {// Crear un usuario
    const { correoElectronico } = req.body;
    const { error, value } = userSchema.validate(req.body, { abortEarly: false });
    if (error) {
        return next({ status: 400, message: error.details.map(detail => detail.message).join(", ") });
    }

    const exists = users.some(user => user.correoElectronico === correoElectronico);
    if (exists) {
        return next({ status: 409, message: 'El correo electrónico ya está en uso.' });
    }

    const newUser: User = {
        id: uuidv4(),
        ...value
    };
    users.push(newUser);
    res.status(201).send(newUser);
});

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Obtiene una lista de todos los usuarios
 *     description: Devuelve un array de todos los usuarios.
 *     responses:
 *       200:
 *         description: Una lista de usuarios
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */
app.get('/users', (req, res) => { // Obtener todos los usuarios
    res.status(200).send(users);
});
  
/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Obtiene un usuario específico por ID
 *     description: Devuelve un solo usuario.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: El ID del usuario
 *     responses:
 *       200:
 *         description: Detalles del usuario
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: Usuario no encontrado
 */
app.get('/users/:id', (req, res, next) => { // Obtener un usuario
    const user = users.find(u => u.id === req.params.id);
    if (!user) {
      return next({ status: 404, message: 'Usuario no encontrado.' });
    }
    res.status(200).send(user);
});
  
/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Actualiza un usuario existente
 *     description: Actualiza datos de un usuario basado en el ID proporcionado.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: El ID del usuario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserInput'
 *     responses:
 *       200:
 *         description: Usuario actualizado correctamente
 *       400:
 *         description: Error de validación en los datos de entrada
 *       404:
 *         description: Usuario no encontrado
 *       409:
 *         description: El correo electrónico ya está en uso por otro usuario
 */
app.put('/users/:id', (req, res, next) => { // Actualizar un usuario
    const { correoElectronico } = req.body;
    const userIndex = users.findIndex(u => u.id === req.params.id);
    if (userIndex === -1) {
        return next({ status: 404, message: 'Usuario no encontrado.' });
    }

    const { error, value } = userSchema.validate(req.body, { abortEarly: false });
    if (error) {
        const errorMessage = error.details.map(detail => detail.message).join(", ");
        return next({ status: 400, message: errorMessage });
    }

    const exists = users.some((user, index) => user.correoElectronico === correoElectronico && index !== userIndex);
    if (exists) {
        return next({ status: 409, message: 'El correo electrónico ya está en uso por otro usuario.' });
    }

    const updatedUser = { ...users[userIndex], ...value };
    users[userIndex] = updatedUser;
    res.status(200).send(updatedUser);
});

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Elimina un usuario
 *     description: Elimina un usuario basado en el ID proporcionado.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: El ID del usuario
 *     responses:
 *       204:
 *         description: Usuario eliminado correctamente
 *       404:
 *         description: Usuario no encontrado
 */
app.delete('/users/:id', (req, res, next) => { // Eliminar un usuario
    const userIndex = users.findIndex(u => u.id === req.params.id);
    if (userIndex === -1) {
      return next({ status: 404, message: 'Usuario no encontrado.' });
    }
    users.splice(userIndex, 1);
    res.status(204).send();
});

// Middleware de manejo de errores
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err);
    const status = err.status || 500;
    const message = err.message || 'Ocurrió un error inesperado.';
    res.status(status).send({ message });
});

// Iniciar el servidor
const PORT = 3000; 
if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
}
  
export default app;

  
  
