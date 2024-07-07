const {User} = require('../models');

const getUserById = async (req, res) => {
    const {id} = req.params;
    const userId = req.user.userId;

    try {
        const user = await User.findByPk(id);

        if(!user) {
            return res.status(404).json({
                status:"error",
                message: "User not found",
                statusCode: 404
            });
        }
        if(user.userId !== userId) {
            return res.status(403).json({
                status: "error",
                message: "Access denied",
                statusCode: 403
            });
        }
        return res.status(200).json({
            status: "success",
            data: user
        });
    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: "Failed to fetch user",
            statusCode: 500
        })
    }
}

module.exports = {
    getUserById
}