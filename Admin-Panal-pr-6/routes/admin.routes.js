const express = require('express');
const { addAdminPage, addAdmin, viewAllAdmins, deleteAdmin, updateAdminPage, updateAdmin } = require('../controller/admin.controller');
const uploadImage = require('../middleware/uploadImage');

const routes = express.Router();

routes.get("/add-admin", addAdminPage);
routes.post("/add-admin", uploadImage.single('profileImage'), addAdmin);
routes.get("/view-admins", viewAllAdmins);
routes.get("/delete-admin/:id", deleteAdmin);
routes.get("/edit-admin/:id", updateAdminPage);
routes.post("/update-admin", uploadImage.single('profileImage'), updateAdmin);

module.exports = routes;