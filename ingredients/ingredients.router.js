const express = require('express');
const langController = require('./ingredients.controller');

const router = express.Router();

// get requests
router.get('/get', langController.get);

// post requests
router.post('/add', langController.add);
router.post('/update', langController.update);

module.exports = router;