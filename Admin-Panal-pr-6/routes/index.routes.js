const express = require('express');
const { dashboard, loginPage, loginuser, logOutAdmin, profilePage, changePasswordPage, changePassword, forgotPasswordPage, sendOtp, verifyOtpPage, verifyOtp, resetPasswordPage, resetpassword } = require('../controller/auth.controller');
const passport = require('passport');

const routes = express.Router();

// Web (Frontend) Routes
routes.use("/", require("./web.routes"));

// Admin Authentication Routes
routes.get("/admin", loginPage);
routes.post("/admin/login", passport.authenticate('admin-local', {failureRedirect: '/admin', failureFlash: true}), loginuser);
routes.get("/admin/logout", logOutAdmin);

// Admin Protected Routes
routes.get("/dashboard", passport.checkAdmin, dashboard);
routes.get("/admin/profile", passport.checkAdmin, profilePage);
routes.get("/change-password", passport.checkAdmin, changePasswordPage);
routes.post("/change-password", passport.checkAdmin, changePassword);

routes.get("/forgot-password", forgotPasswordPage);
routes.post("/send-otp", sendOtp);
routes.get("/verify-otp", verifyOtpPage);
routes.post("/verify-otp", verifyOtp);
routes.get("/reset-password", resetPasswordPage);
routes.post("/reset-password", resetpassword);

routes.use("/admin/manage", passport.checkAdmin, require("./admin.routes"));
routes.use("/blog", passport.checkAdmin, require("./blog.routes"));
routes.use("/category", passport.checkAdmin, require("./category.routes"));
routes.use("/subcategory", passport.checkAdmin, require("./subCategory.routes"));
routes.use("/extracategory", passport.checkAdmin, require("./extraCategory.routes"));
routes.use("/product", passport.checkAdmin, require("./product.routes"));

module.exports = routes;