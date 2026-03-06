const express = require('express');
const { 
    registerUser, 
    loginUser, 
    createUser, 
    getAdmins, 
    getManagers, 
    getEmployees, 
    updateUser, 
    deleteUser 
} = require('../controller/auth.controller');
const { uploadImage } = require('../middleware/uploadImage');
const { verifyToken } = require('../middleware/verifyToken');
const { checkRole } = require('../middleware/checkRole');

const routes = express.Router();

// Public routes
routes.post("/register", uploadImage.single('profileImage'), registerUser);
routes.post("/login", uploadImage.none(), loginUser);

// Admin routes
routes.post("/create-user", verifyToken, checkRole(['Admin', 'Manager']), uploadImage.single('profileImage'), createUser);
routes.get("/admins", verifyToken, checkRole(['Admin']), getAdmins);
routes.get("/managers", verifyToken, checkRole(['Admin', 'Manager']), getManagers);
routes.get("/employees", verifyToken, checkRole(['Admin', 'Manager', 'Employee']), getEmployees);

// Update and Delete routes
routes.put("/update-user/:id", verifyToken, checkRole(['Admin', 'Manager']), uploadImage.single('profileImage'), updateUser);
routes.delete("/delete-user/:id", verifyToken, checkRole(['Admin', 'Manager']), deleteUser);

module.exports = routes;