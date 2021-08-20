const express = require('express');
const surgeryController = require('../controllers/surgeryController');



const router = express.Router();

router.post('/createSurgery',  surgeryController.createSurgery);

module.exports = router;
