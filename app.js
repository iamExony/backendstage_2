const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth'); // Adjust the path as necessary
const organisationRoutes = require('./routes/org'); // Adjust the path as necessary

const app = express();

app.use(bodyParser.json());

app.use('/api/auth', authRoutes);
app.use('/api/organisations', organisationRoutes);

module.exports = app;
