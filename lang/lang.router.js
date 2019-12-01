const express = require('express');
const langController = require('./lang.controller');

const router = express.Router();

// get requests
router.get('/pack', langController.pack);

// post requests
router.post('/addPack', langController.addPack);
router.post('/updatePack', langController.updatePack);

module.exports = router;