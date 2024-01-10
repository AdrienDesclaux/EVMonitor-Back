const supertest = require('supertest');
const bcrypt = require('bcrypt');
const app = require('../index');
const User = require('../src/models/User');
const validateForm = require('../src/utils/validateForm');

describe('Signup API endpoint', () => {
  test('It should create a new user', async () => {
    // Init fake data
    const userData = {
      email: 'test@example.com',
      password: 'Test123!',
      username: 'testuser',
      is_admin: false,
    };

    // Use a mock to simulate that the user isn't found
    User.findOne = jest.fn().mockResolvedValue(null);

    // Mocking the bcrypt.hash function to return a hashed password
    bcrypt.hash = jest.fn().mockResolvedValue('hashedPassword');

    // Mocking the User.create function to indicate success
    User.create = jest.fn().mockResolvedValue();

    const response = await supertest(app).post('/users/signup').send(userData);

    // Check that the response meets expectations
    expect(response.status).toBe(201);
    expect(response.body).toEqual({ message: 'Utilisateur crée avec succès' });
    // Check if the method has been called once and not more
    expect(User.findOne).toHaveBeenCalledTimes(1);
    expect(bcrypt.hash).toHaveBeenCalledTimes(1);
    expect(User.create).toHaveBeenCalledTimes(1);
  });

  test('It should handle missing fields', async () => {
    // Send signup informations via Supertest
    const response = await supertest(app).post('/users/signup').send({
      email: 'test@example.com',
      // Missing password and username intentionally to simulate an missing field
    });

    // Check that the response meets expectations
    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: 'Un ou plusieurs champs sont manquants',
    });
  });

  test('It should handle duplicate email or username', async () => {
    // Mocking User.findOne to return a user, indicating that the email or username is in use
    User.findOne = jest.fn().mockResolvedValue({});

    // Send signup informations via Supertest
    const response = await supertest(app).post('/users/signup').send({
      email: 'existing@example.com',
      password: 'Test@123',
      username: 'existinguser',
    });

    // Check that the response meets expectations
    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: "L'email ou le pseudonyme n'est pas disponible",
    });
  });

  test('It should return true for a valid password', () => {
    // Create a password that has a valid format
    const validPassword = 'StrongPassword1!23';
    // Use the validatePassword method to check if the method is working properly
    const passwordChecked = validateForm.validatePassword(validPassword);
    expect(passwordChecked).toBe(true);
  });

  test('It should return false for a password with invalid format', () => {
    // Create a password that has a unvalid format
    const invalidPassword = 'weakpassword';
    // Use the validatePassword method to check if the method is working properly
    const passwordChecked = validateForm.validatePassword(invalidPassword);
    expect(passwordChecked).toBe(false);
  });

  test('It should return false for a email with invalid format', () => {
    // Create a email that has a unvalid format
    const invalidEmail = 'test@.com';
    // Use the validateEmail method to check if the method is working properly
    const emailChecked = validateForm.validateEmail(invalidEmail);
    expect(emailChecked).toBe(false);
  });

  test('It should return true for a valid email', () => {
    // Create a email that has a valid format
    const validEmail = 'test@test.com';
    // Use the validateEmail method to check if the method is working properly
    const emailChecked = validateForm.validateEmail(validEmail);
    expect(emailChecked).toBe(true);
  });
});
