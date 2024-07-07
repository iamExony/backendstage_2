// models/index.js
const sequelize = require('../config/database');
const User = require('./user');
const Organisation = require('./organisation');
const UserOrganisations = require('./userorganisation');

User.belongsToMany(Organisation, { through: UserOrganisations });
Organisation.belongsToMany(User, { through: UserOrganisations });

module.exports = {
  sequelize,
  User,
  Organisation,
  UserOrganisations
};
