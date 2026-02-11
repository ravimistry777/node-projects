const express = require('express');
const { addCategoryPage, addCategory, viewAllCategories, deleteCategory, updateCategoryPage, updateCategory } = require('../controller/category.controller');
const uploadImage = require('../middleware/uploadImage');

const routes = express.Router();

routes.get("/add-category", addCategoryPage);
routes.post("/add-category", uploadImage.single('categoryImage'), addCategory);
routes.get("/view-categories", viewAllCategories);
routes.get("/delete-category/:id", deleteCategory);
routes.get("/edit-category/:id", updateCategoryPage);
routes.post("/update-category", uploadImage.single('categoryImage'), updateCategory);

module.exports = routes;
