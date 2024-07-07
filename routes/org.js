const express = require('express');
const { createOrganisation, getUserOrganisations, getOrganisationById } = require('../controllers/orgController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/', authMiddleware, createOrganisation);
router.get('/', authMiddleware, getUserOrganisations);
router.get('/:orgId', authMiddleware, getOrganisationById);

module.exports = router;
