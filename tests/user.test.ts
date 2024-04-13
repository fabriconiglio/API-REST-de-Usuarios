import request from 'supertest';
import app from '../src/server';
import { Server } from 'http';

describe('API de Usuarios', () => {
    let userId: string;
    let server: Server;

    beforeAll((done) => {
        server = app.listen(0, () => {
          const address = server.address();
          const port = typeof address === 'string' ? address : address?.port;
          console.log(`Test server listening on port ${port}`);
          done();
        });
    });
  
    afterAll((done) => {
      server.close(done);
    });
  
    // POST /users
    describe('POST /users', () => {
      it('debería crear un nuevo usuario', async () => {
        const newUser = {
          nombre: 'Juan Perez',
          correoElectronico: 'juan@example.com',
          edad: 30
        };
  
        const response = await request(app)
          .post('/users')
          .send(newUser);
  
        expect(response.statusCode).toBe(201);
        expect(response.body).toHaveProperty('id');
        userId = response.body.id; // Guardar el ID para usar en otras pruebas
      });
    });
  
    // GET /users
    describe('GET /users', () => {
      it('debería obtener todos los usuarios', async () => {
        const response = await request(app)
          .get('/users');
  
        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
      });
    });
  
    // GET /users/:id
    describe('GET /users/:id', () => {
      it('debería obtener un usuario específico', async () => {
        const response = await request(app)
          .get(`/users/${userId}`);
  
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('id', userId);
      });
    });
  
    // PUT /users/:id
    describe('PUT /users/:id', () => {
      it('debería actualizar un usuario existente', async () => {
        const updatedUser = {
          nombre: 'Juan Perez Modificado',
          correoElectronico: 'juanmod@example.com',
          edad: 35
        };
  
        const response = await request(app)
          .put(`/users/${userId}`)
          .send(updatedUser);
  
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('nombre', updatedUser.nombre);
      });
    });
  
    // DELETE /users/:id
    describe('DELETE /users/:id', () => {
      it('debería eliminar un usuario', async () => {
        const response = await request(app)
          .delete(`/users/${userId}`);
  
        expect(response.statusCode).toBe(204);
      });
    });
});