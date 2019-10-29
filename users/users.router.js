const express = require('express');
const userController = require('./users.controller');

const router = express.Router();
// routes
router.post('/authenticate', userController.authenticate);
router.post('/registration', userController.registration);
router.post('/update', userController.updateMeOrRoleById);
router.get('/myProfile', userController.myProfile);
router.get('/', userController.getAllOrById);

module.exports = router;