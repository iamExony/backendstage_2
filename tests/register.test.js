// tests/register.test.js
const request = require('supertest');
const app = require('../app');

describe('User Registration', () => {
  it('should register a new user', async () => {
    const res = await request(app)
      .post('/register')
      .send({
        userId: 'testuser',
        firstName: 'Test',
        lastName: 'User',
        phone: '1234567890'
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('userId', 'testuser');
  });

  it('should not register a user with missing fields', async () => {
    const res = await request(app)
      .post('/register')
      .send({
        firstName: 'Test',
        lastName: 'User'
      });
    expect(res.statusCode).toEqual(422);
    expect(res.body.errors[0].field).toEqual('userId');
  });
});
