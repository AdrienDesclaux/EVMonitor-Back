const supertest = require('supertest');
const bcrypt = require('bcrypt');
const app = require('../index');
const User = require('../src/models/User');

describe('Login API endpoint', () => {
  test('It should return success message on successful login', async () => {
    // Create an user for the test
    const testUser = {
      username: 'jbletesteur',
      email: 'jbletesteur@outlook.com',
      password: await bcrypt.hash('letesteurFou99!', 10),
      is_admin: false,
    };

    // Use a mock to avoid interacting with the real database
    User.findOne = jest.fn().mockResolvedValue(testUser);

    // Send a request via supertest
    const response = await supertest(app).post('/users/login').send({
      email: 'jbletesteur@outlook.com',
      password: 'letesteurFou99!',
    });

    // Check that the response meets expectations
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'Connexion réussie' });
  });

  test('It should return error message for incorrect email', async () => {
    // Use a mock to simulate that the user isn't found
    User.findOne = jest.fn().mockResolvedValue(null);

    // Send a connection request via Supertest
    const response = await supertest(app).post('/users/login').send({
      email: 'jbletesteur@outlook.com',
      password: 'letesteurFou99!',
    });

    // Check that the response meets expectations
    expect(response.status).toBe(401);
    expect(response.body).toEqual({ error: 'Email ou mot de passe incorrect' });
  });
});
