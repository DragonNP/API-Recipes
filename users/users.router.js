const express = require('express');
const router = express.Router();
const userController = require('./users.controller');
const role = require('./_helpers/role');

// routes
router.post('/authenticate', userController.authenticate);
router.post('/registration', userController.registration);
router.get('/myProfile', userController.myProfile);
router.get('/', userController.getAllOrById);

module.exports = router;