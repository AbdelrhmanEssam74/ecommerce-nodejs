// route.js
const express = require('express');
const router = express.Router();
const AddressController = require('../Controllers/addressController');

router.post('/address', AddressController.address);
router.get('/address/:userId', AddressController.getAddress);

module.exports = router;
