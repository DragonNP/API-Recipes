const express = require('express');
const langController = require('./lang.controller');

const router = express.Router();

// get requests
router.get('/byLang', langController.byLang);
router.get('/all', langController.all);

// post requests
router.post('/addPack', langController.add);
router.post('/updatePack', langController.update);

module.exports = router;