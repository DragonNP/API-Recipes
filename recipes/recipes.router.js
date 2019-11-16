const express = require('express');
const recipesController = require('./recipes.controller');

const router = express.Router();

// post requests
router.post('/add', recipesController.add);
router.post('/addFavourites', recipesController.addFavourites);

// get requests
router.get('/my', recipesController.my);
router.get('/all', recipesController.all);
router.get('/id', recipesController.byId);
router.get('/accountId', recipesController.byAccountId);

// delete request
router.delete('/', recipesController.deleteById);

module.exports = router;