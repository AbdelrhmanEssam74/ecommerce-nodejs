// route.js
const express = require('express');
const router = express.Router();
const HomeController = require('../Controllers/HomeController')
const AddressController = require('../Controllers/addressController');
const ShippingController = require('../Controllers/shippingController')
const CheckoutController = require('../Controllers/checkoutController')
const paypalController = require('../Controllers/paypalController');
const orderController = require('../Controllers/orderController')
const reviewController = require('../Controllers/reviewController')
const productController = require('../Controllers/searchController');
// ***********************
const authenticationAndAuthorizationControllers=require('../Controllers/authenticationAndAuthorization');
const dashboardControllers=require('../Controllers/dashboard')
const productsController=require('../Controllers/productsController')
const cartItemsControllers=require('../Controllers/cartController')
const getWishlistItemsControllers=require('../Controllers/wishListController')
const ordersConterollers=require('../Controllers/orders')
const profileControllers=require('../Controllers/profile')
const {authMiddleware, checkAuthorize} = require("../middleware/auth");
// ****************
router.get('/', HomeController.home)

router.get('/address/:userId', AddressController.getAddress);
router.post('/address', AddressController.address);

router.get('/shipping', ShippingController.getShippingOptions)

router.post('/checkout', CheckoutController.createOrder)

router.post('/paypal/create-order', paypalController.createPayPalOrder);

router.get('/orders/:userId', orderController.getSpecificOrders)
router.get('/order/:orderId', orderController.getOrderDetails);

router.post('/reviews', reviewController.addReview)
router.get('/reviews/:productId', reviewController.getProductReviews)

router.get('/products/search', productController.searchProducts);


// ***************************************
router.post('/login',authenticationAndAuthorizationControllers.loginFunction)
router.post('/register',authenticationAndAuthorizationControllers.registerFunction)
router.post('/forget-pass',authenticationAndAuthorizationControllers.forgetPassFunction)
router.post('/reset-pass',authenticationAndAuthorizationControllers.resetPassFunction)
// router.get('/dashboard',authMiddleware,checkAuthorize,dashboardControllers.getDashboard)


// ***************************************
router.get('/products',productsController.getProducts)
router.post('/products/add',productsController.addProductFunction)
// router.post('/product-images',productsController.addProductImages)
router.get('/products/filter',productsController.filteringProducts)
router.get('/product/:id',productsController.selctingProductWithItsId)

// ***************************************
router.get('/cart/:uid',cartItemsControllers.getCartItems)
router.post('/cart/add',cartItemsControllers.addItemToCart)
router.delete('/cart/delete/:itemId',cartItemsControllers.deleteFromCart)
router.put('/cart/update/:itemId',cartItemsControllers.updateCart)

// ***************************************
router.get('/wishlist/:uid',getWishlistItemsControllers.getWishlistItems)
router.post('/wishlist/add',getWishlistItemsControllers.addItemToWishList)
router.delete('/wishlist/delete/:itemid',getWishlistItemsControllers.removeItemFromWishList)


// router.get('/orders',ordersConterollers.getALlOrders)
// router.delete('/orders/:uid',ordersConterollers.deletelOrder)
// router.patch('/orders/:id/address',ordersConterollers.editOrdershippingAddress)
// router.patch('/orders/:id/option',ordersConterollers.editOrdershippingOption)
// router.patch('/orders/:id/paymentmethod',ordersConterollers.updateOrderPaymentMethod)
// router.delete('/orders/:id/delete',ordersConterollers.cancelOrder)


router.patch('/profile/update',profileControllers.updateProfile)
router.delete('/profile/delete',profileControllers.deleteAccount)
// ******************************************
module.exports = router;
