const express = require('express');
const router = express.Router();
const webController = require('../controller/web.controller');
const passport = require('passport');

// Product Browsing
router.get('/', webController.homePage);
router.get('/product-details/:id', webController.productDetails);

// User Authentication
router.get('/login', webController.loginPage);
router.post('/login', passport.authenticate('user-local', {
    failureRedirect: '/login',
    failureFlash: true
}), webController.loginSuccess);
router.get('/signup', webController.signupPage);
router.post('/signup', webController.signupUser);
router.get('/logout', webController.logoutUser);

// Customer Profile & Orders
router.get('/profile', passport.checkCustomer, webController.customerProfile);
router.get('/orders', passport.checkCustomer, webController.ordersPage);

// Cart
router.get('/cart', webController.cartPage);
router.get('/add-to-cart/:id', webController.addToCart);
router.get('/cart/update/:id/:action', webController.updateCart);
router.get('/cart/update/:id/:size/:action', webController.updateCart);
router.get('/cart/remove/:id', webController.removeFromCart);
router.get('/cart/remove/:id/:size', webController.removeFromCart);

module.exports = router;
