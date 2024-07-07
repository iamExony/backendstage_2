const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User, Organisation, UserOrganisation } = require('../models');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

const register = async (req, res) => {
  const { firstName, lastName, email, password, phone } = req.body;

  // Validate request
  if (!firstName || !lastName || !email || !password) {
    return res.status(422).json({
      errors: [{ field: "all", message: "All fields are required" }]
    });
  }

  try {
    // Check for existing user
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(422).json({
        errors: [{ field: "email", message: "Email already in use" }]
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = await User.create({
      userId: uuidv4(),
      firstName,
      lastName,
      email,
      password: hashedPassword,
      phone
    });

    // Create default organisation
    const orgName = `${firstName}'s Organisation`;
    const newOrg = await Organisation.create({
      orgId: uuidv4(),
      name: orgName,
      description: ''
    });

    // Create association between user and organisation
    await UserOrganisation.create({
      userId: newUser.userId,
      orgId: newOrg.orgId
    });

    // Generate token
    const token = jwt.sign({ userId: newUser.userId, email: newUser.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

    return res.status(201).json({
      status: "success",
      message: "Registration successful",
      data: {
        accessToken: token,
        user: {
          userId: newUser.userId,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          email: newUser.email,
          phone: newUser.phone
        }
      }
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Registration unsuccessful",
      statusCode: 500
    });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  // Validate request
  if (!email || !password) {
    return res.status(422).json({
      errors: [{ field: "all", message: "Email and password are required" }]
    });
  }

  try {
    // Check for user
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({
        status: "error",
        message: "Authentication failed",
        statusCode: 401
      });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        status: "error",
        message: "Authentication failed",
        statusCode: 401
      });
    }

    // Generate token
    const token = jwt.sign({ userId: user.userId, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

    return res.status(200).json({
      status: "success",
      message: "Login successful",
      data: {
        accessToken: token,
        user: {
          userId: user.userId,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone
        }
      }
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Authentication failed",
      statusCode: 500
    });
  }
};

module.exports = {
  register,
  login
};
