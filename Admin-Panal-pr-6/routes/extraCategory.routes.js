const express = require('express');
const routes = express.Router();
const extraCategoryController = require('../controller/extraCategory.controller');
const passport = require('passport');

routes.get('/add-extracategory', extraCategoryController.addExtraCategoryPage);
routes.post('/add-extracategory', extraCategoryController.addExtraCategory);
routes.get('/view-extracategories', extraCategoryController.viewExtraCategories);
routes.get('/delete-extracategory/:id', extraCategoryController.deleteExtraCategory);

// AJAX Route for dependent dropdown
routes.get('/get-subcategories', extraCategoryController.getSubCategories);

module.exports = routes;