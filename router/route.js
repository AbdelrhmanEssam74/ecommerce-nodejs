// route.js
const express = require('express');
const router = express.Router();
const AddressController = require('../Controllers/addressController');
const ShippingController = require('../Controllers/shippingController')
const CheckoutController = require('../Controllers/checkoutController')
const paypalController = require('../Controllers/paypalController');


router.post('/address', AddressController.address);
router.get('/address/:userId', AddressController.getAddress);

router.get('/shipping', ShippingController.getShippingOptions)

router.post('/checkout' , CheckoutController.createOrder)

router.post('/paypal/create-order', paypalController.createPayPalOrder);
module.exports = router;
