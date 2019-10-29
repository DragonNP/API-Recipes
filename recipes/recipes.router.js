const express = require('express');
const recipesController = require('./recipes.controller');

const router = express.Router();
// routes
router.post('/add', recipesController.addRecipe);
router.get('/', recipesController.getAllOrById);

module.exports = router;