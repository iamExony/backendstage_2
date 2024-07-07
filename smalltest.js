const User = require('./models/user');
const Organisation = require('./models/organisation');
const UserOrganisations = require('./models/userorganisation');
const sequelize = require('./config/database');

Organisation.belongsToMany(User, { through: UserOrganisations });
User.belongsToMany(Organisation, { through: UserOrganisations });

(async () => {
    await sequelize.sync({ force: true });
    console.log('Database synced successfully');
})();
