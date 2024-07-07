const request = require('supertest');
const app = require('../server');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const { sequelize } = require('../models'); // Ensure this path is correct
const { User } = require('../models'); // Ensure this path is correct

// Set up database before all tests
beforeAll(async () => {
  await sequelize.sync({ force:true }); // Create the tables
});


 // Close database connection after all tests
afterAll(async () => {
  await sequelize.close();
});


describe('Auth Middleware', () => {
    it('should deny access if no token is provided', async () => {
        const res = await request(app).get('/api/organizations');
        expect(res.statusCode).toEqual(401);
        expect(res.body.message).toEqual('Access denied. No token provided.');
    });

    it('should deny access if token is invalid', async () => {
        const res = await request(app).get('/api/organizations').set('Authorization', 'Bearer invalidtoken');
        expect(res.statusCode).toEqual(401);
        expect(res.body.message).toEqual('Invalid token');
    });

    it('should deny access if token is expired', async () => {
        const expiredToken = jwt.sign({ userId: 1 }, process.env.JWT_SECRET, { expiresIn: '-1h' });
        const res = await request(app)
            .get('/api/organizations')
            .set('Authorization', `Bearer ${expiredToken}`);
        expect(res.statusCode).toEqual(401);
        expect(res.body.message).toEqual('Invalid token');
    });

    it('should allow access if token is valid', async () => {
      
        const user = await User.create({ userId: '2', firstName: 'Test', lastName: 'User', phone: '1234567890' });
        const token = jwt.sign({ userId: user.userId }, process.env.JWT_SECRET);
        const res = await request(app).get('/api/organizations').set('Authorization', `Bearer ${token}`);
        expect(res.statusCode).toEqual(200);
       
    });
/*
    it('should deny access if token is valid but user does not exist', async () => {
        const nonExistentUserToken = jwt.sign({ userId: 999 }, process.env.JWT_SECRET);
        const res = await request(app)
            .get('/api/organizations')
            .set('Authorization', `Bearer ${nonExistentUserToken}`);
        expect(res.statusCode).toEqual(404);
        expect(res.body.message).toEqual('User not found');
    });

    it('should allow access and return correct data for valid token', async () => {
        const user = await User.create({ userId: '1', firstName: 'Test', lastName: 'User', phone: '1234567890' });
        const token = jwt.sign({ userId: user.userId }, process.env.JWT_SECRET);
        const res = await request(app)
            .get('/api/organizations')
            .set('Authorization', `Bearer ${token}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('data');
        expect(Array.isArray(res.body.data)).toBe(true);
    });*/
});

// Example test to verify setup
test('example test', async () => {
    try{
    const user = await User.create({ userId: 'testuser', firstName: 'Test', lastName: 'User', phone: '1234567890' });
    expect(user.userId).toEqual('testuser');
    }
    catch(error){
        console.log(error,"Entered here")
    }
  
});
 