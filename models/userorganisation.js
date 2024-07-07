const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const UserOrganisations = sequelize.define('UserOrganisations', {
    UserId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Users',
            key: 'id'
        }
    },
    OrganisationId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Organisations',
            key: 'id'
        }
    }
});

UserOrganisations.associate = (models) => {
    UserOrganisations.belongsTo(models.User, { foreignKey: 'UserId' });
    UserOrganisations.belongsTo(models.Organisation, { foreignKey: 'OrganisationId' });
};

module.exports = UserOrganisations;
