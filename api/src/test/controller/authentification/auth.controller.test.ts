import request from "supertest";
import app from "../../../app";
import User from '../../../models/user.models';
import { loginUser, registerUser } from '../../../services/auth.services';
import { describe, expect, it, jest } from "@jest/globals";
import { RegisterUserForm } from "../../../services/auth.services";
import { RegisterUserResponse } from "../../../services/auth.services";

jest.mock('../../../services/auth.services');


describe('POST /login', () => {
  it('devrait renvoyer une erreur si les champs sont manquants', async () => {
    const response = await request(app)
      .post('/login') // URL de la route à tester
      .send({ email: '' }); // Données manquantes

    expect(response.status).toBe(400); // Vérifier que le statut est 400 (bad request)
    expect(response.body).toHaveProperty('error', 'Missing or empty field');
  });

  it('devrait retourner un token pour une connexion valide', async () => {
    // Mock du service loginUser
    (loginUser as jest.Mock).mockResolvedValue({ token: 'mockedToken' } as RegisterUserResponse);

    const response = await request(app)
      .post('/login')
      .send({ email: 'test@test.com', password: 'password123' });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token', 'mockedToken');
  });
});

describe('POST /register', () => {
  it('devrait renvoyer une erreur si les champs sont manquants', async () => {
    const response = await request(app)
      .post('/register')
      .send({ email: '', password: '', username: '' });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error', 'Missing or empty field');
  });

  it('devrait retourner un token pour une inscription valide', async () => {
    // Mock du service registerUser
    (registerUser as jest.Mock).mockResolvedValue({
      token: 'mockedToken',
      savedUser: { email: 'test@test.com', username: 'testuser' },
    });

    const response = await request(app)
      .post('/register')
      .send({ email: 'test@test.com', password: 'password123', username: 'testuser' });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('token', 'mockedToken');
    expect(response.body.user).toHaveProperty('email', 'test@test.com');
    expect(response.body.user).toHaveProperty('username', 'testuser');
  });

  it('devrait renvoyer une erreur pour un email invalide', async () => {
    const response = await request(app)
      .post('/register')
      .send({ email: 'invalid-email', password: 'password123', username: 'testuser' });

    expect(response.status).toBe(200); 
    expect(response.body).toHaveProperty('error', 'Invalid email format');
  });
});
