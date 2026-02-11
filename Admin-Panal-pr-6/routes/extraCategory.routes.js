const express = require('express');
const routes = express.Router();
const extraCategoryController = require('../controller/extraCategory.controller');
const passport = require('passport');

routes.get('/add-extracategory', passport.checkAuthenticated, extraCategoryController.addExtraCategoryPage);
routes.post('/add-extracategory', passport.checkAuthenticated, extraCategoryController.addExtraCategory);
routes.get('/view-extracategories', passport.checkAuthenticated, extraCategoryController.viewExtraCategories);
routes.get('/delete-extracategory/:id', passport.checkAuthenticated, extraCategoryController.deleteExtraCategory);

// AJAX Route for dependent dropdown
routes.get('/get-subcategories', passport.checkAuthenticated, extraCategoryController.getSubCategories);

module.exports = routes;