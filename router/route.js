// route.js
const express = require('express');
const router = express.Router();
const AddressController = require('../Controllers/addressController');
const ShippingController = require('../Controllers/shippingController')


router.post('/address', AddressController.address);
router.get('/address/:userId', AddressController.getAddress);
router.get('/shipping', ShippingController.getShippingOptions)
module.exports = router;
