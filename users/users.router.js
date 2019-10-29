const express = require('express');
const usersController = require('./users.controller');

const router = express.Router();
// routes
router.post('/authenticate', usersController.authenticate);
router.post('/registration', usersController.registration);
router.post('/update', usersController.updateMeOrRoleById);
router.get('/myProfile', usersController.myProfile);
router.get('/', usersController.getAllOrById);

module.exports = router;