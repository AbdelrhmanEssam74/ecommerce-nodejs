// route.js
const express = require('express');
const router = express.Router();
const AddressController = require('../Controllers/addressController');
const ShippingController = require('../Controllers/shippingController')
const CheckoutController = require('../Controllers/checkoutController')
const paypalController = require('../Controllers/paypalController');
const orderController = require('../Controllers/orderController')
const reviewController = require('../Controllers/reviewController')
const productController = require('../Controllers/searchController');

router.post('/address', AddressController.address);
router.get('/address/:userId', AddressController.getAddress);

router.get('/shipping', ShippingController.getShippingOptions)

router.post('/checkout', CheckoutController.createOrder)

router.post('/paypal/create-order', paypalController.createPayPalOrder);

router.get('/orders/:userId', orderController.getSpecificOrders)
router.get('/order/:orderId', orderController.getOrderDetails);

router.post('/reviews',reviewController.addReview)
router.get('/reviews/:productId' , reviewController.getProductReviews)

router.get('/products/search', productController.searchProducts);
module.exports = router;
