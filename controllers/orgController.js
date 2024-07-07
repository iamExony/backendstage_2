const {Organisation, User} = require('../models');
const {v4: uuidv4} = require('uuid');

const createOrganisation = async (req, res) => {
    const {name, description} = req.body;
    const userId = req.user.userId;

    if(!name) {
        return res.status(422).json({
            errors: [{field: "name", message: "Name is required"}]
        })
    }
    try {
        const newOrg = await Organisation.create({
            orgId:uuidv4(),
            name,
            description
        });
    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: "organisation creation failed",
            statusCode: 500
        });
    }
};

const getUserOrganisations = async (req, res) => {
    const userId = req.user.userId;

    try {
        const user = User.findByPk(userId, {
            include: Organisation
        });

        return res.status(200).json({
            status: "success",
            data: {organisation: user.organisations}
        });
    } catch (error){
        return res.status(500).json({
            status: "error",
            message: "Failed to fetch organisations",
            statusCode: 500
        });
    }
};

const getOrganisationById = async (req, res) => {
    const {orgId} = req.params;
    const userId = req.user.userId;

    try {
        const organisation = await Organisation.findByPk(orgId, {
            incldue: User
        });

        if(!organisation) {
            return res.status(404).json({
                status: "error",
                message: "Organisation not found",
                statusCode: 404
            });
        }
        const userBelongsToOrg = organisation.Users.some(user => user.userId === userId)
        
        if(!userBelongsToOrg) {
            return res.status(403).json({
                status: "error",
                message: "Access denied",
                statusCode: 403
            });
        }

        return res.status(200).json({
            status: "success",
            data: organisation
        });
} catch (error) {
    return res.status(500).json({
        status:"error",
        message: "Failed to fetch organisation",
        statusCode: 500
    })
}
}

module.exports = {
    createOrganisation,
    getUserOrganisations,
    getOrganisationById
}