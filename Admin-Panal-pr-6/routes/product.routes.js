const express = require('express');
const routes = express.Router();
const productController = require('../controller/product.controller');
const upload = require('../middleware/uploadImage');
const passport = require('passport');

routes.get('/add-product', passport.checkAuthenticated, productController.addProductPage);
routes.post('/add-product', passport.checkAuthenticated, upload.single('productImage'), productController.addProduct);
// View Products
routes.get('/view-products', passport.checkAuthenticated, productController.viewProducts);

// View Single Product Details
routes.get('/product-details/:id', passport.checkAuthenticated, productController.viewProductDetails);

// Update Product
routes.get('/update-product/:id', passport.checkAuthenticated, productController.updateProductPage);
routes.post('/update-product/:id', passport.checkAuthenticated, upload.single('productImage'), productController.updateProduct);

// Delete Product
routes.get('/delete-product/:id', passport.checkAuthenticated, productController.deleteProduct);

// AJAX Route
routes.get('/get-subcategories', passport.checkAuthenticated, productController.getSubCategoriesByCategory);
routes.get('/get-extracategories', passport.checkAuthenticated, productController.getExtraCategoriesBySubCategory);

module.exports = routes;