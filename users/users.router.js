const express = require('express');
const usersController = require('./users.controller');

const router = express.Router();

// post requests
router.post('/authenticate', usersController.authenticate);
router.post('/registration', usersController.registration);
router.post('/update', usersController.update);

// get requests
router.get('/myFavourites', usersController.myFavourites);
router.get('/myProfile', usersController.myProfile);
router.get('/', usersController.getAllOrById);

module.exports = router;