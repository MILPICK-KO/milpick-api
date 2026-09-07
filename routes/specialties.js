const express = require('express');
const router = express.Router();
const specialties_controller = require('../controllers/specialties');

router.get('/all', specialties_controller.get_all_specialties);
router.get('/', specialties_controller.get_all_specialties);

module.exports = router;
