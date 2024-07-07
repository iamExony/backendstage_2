const express = require('express');
const sequelize = require('./config/database');
const User = require('./models/user');
const Organisation = require('./models/organisation');
const UserOrganisation = require('./models/userorganisation');

const app = express();

// Middleware setup
app.use(express.json());

// Routes
const orgRoutes = require('./routes/org');
app.use('/api/organizations', orgRoutes);

const PORT = process.env.PORT || 3000;

// Sync the database and start the server
sequelize.sync({ force: true }).then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}).catch(error => {
    console.error('Error connecting to the database:', error);
});

module.exports = app;
