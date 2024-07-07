const request = require('supertest');
const app = require('../server');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const sequelize = require('../config/database');
const User = require('../models/user');
const Organisation = require('../models/organisation');
const UserOrganisations = require('../models/userorganisation');

// Sync models
Organisation.belongsToMany(User, { through: UserOrganisations });
User.belongsToMany(Organisation, { through: UserOrganisations });

describe('Auth Middleware', () => {
    beforeAll(async () => {
        await sequelize.sync({ force: true }); // Ensure the database is synchronized
    });

    afterAll(async () => {
        await sequelize.close(); // Close the database connection
    });

    it('should deny access if no token is provided', async () => {
        const res = await request(app).get('/api/organizations');
        expect(res.statusCode).toEqual(401);
        expect(res.body.message).toEqual('Access denied. No token provided.');
    });

    it('should deny access if token is invalid', async () => {
        const res = await request(app)
            .get('/api/organizations')
            .set('Authorization', 'invalidtoken');
        expect(res.statusCode).toEqual(401);
        expect(res.body.message).toEqual('Invalid token');
    });

    it('should allow access if token is valid', async () => {
        const token = jwt.sign({ userId: 1 }, process.env.JWT_SECRET);
        const res = await request(app)
            .get('/api/organizations')
            .set('Authorization', token);
        expect(res.statusCode).toEqual(200);
    });
});
