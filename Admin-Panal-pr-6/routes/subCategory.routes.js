const express = require('express');
const { addSubCategoryPage, addSubCategory, viewAllSubCategories, deleteSubCategory, updateSubCategoryPage, updateSubCategory } = require('../controller/subCategory.controller');

const routes = express.Router();

routes.get("/add-subcategory", addSubCategoryPage);
routes.post("/add-subcategory", addSubCategory);
routes.get("/view-subcategories", viewAllSubCategories);
routes.get("/delete-subcategory/:id", deleteSubCategory);
routes.get("/edit-subcategory/:id", updateSubCategoryPage);
routes.post("/update-subcategory", updateSubCategory);

module.exports = routes;
