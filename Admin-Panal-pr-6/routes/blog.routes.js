const express = require('express');
const { blogPage, addBlog, viewAllBlogs, deleteBlog, updateBlogPage, updateBlog, readMore } = require('../controller/blog.controller');
const uploadImage = require('../middleware/uploadImage');

const routes = express.Router();

routes.get("/add-blog", blogPage);
routes.post("/add-blog", uploadImage.single('blogImage'), addBlog);
routes.get("/view-blogs", viewAllBlogs);
routes.get("/delete-blog/:id", deleteBlog);
routes.get("/edit-blog/:id", updateBlogPage);
routes.post("/update-blog", uploadImage.single('blogImage'), updateBlog);
routes.get("/read-more/:id", readMore);

module.exports = routes;
