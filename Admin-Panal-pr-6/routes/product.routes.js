const express = require('express');
const routes = express.Router();
const productController = require('../controller/product.controller');
const upload = require('../middleware/uploadImage');
const passport = require('passport');

routes.get('/add-product', productController.addProductPage);
routes.post('/add-product', upload.single('productImage'), productController.addProduct);
// View Products
routes.get('/view-products', productController.viewProducts);

// View Single Product Details
routes.get('/product-details/:id', productController.viewProductDetails);

// Update Product
routes.get('/update-product/:id', productController.updateProductPage);
routes.post('/update-product/:id', upload.single('productImage'), productController.updateProduct);

// Delete Product
routes.get('/delete-product/:id', productController.deleteProduct);

// AJAX Route
routes.get('/get-subcategories', productController.getSubCategoriesByCategory);
routes.get('/get-extracategories', productController.getExtraCategoriesBySubCategory);

module.exports = routes;