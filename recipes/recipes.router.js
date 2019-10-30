const express = require('express');
const recipesController = require('./recipes.controller');

const router = express.Router();

// post requests
router.post('/add', recipesController.add);
router.post('/addFavourites', recipesController.addFavourites);

// get requests
router.get('/', recipesController.getAllOrById);

// delete request
router.delete('/', recipesController.deleteByID);

module.exports = router;