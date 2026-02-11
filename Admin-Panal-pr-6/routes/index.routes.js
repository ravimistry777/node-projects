const express = require('express');
const { dashboard, loginPage, loginuser, logOutAdmin, profilePage, changePasswordPage, changePassword, forgotPasswordPage, sendOtp, verifyOtpPage, verifyOtp, resetPasswordPage, resetpassword } = require('../controller/auth.controller');
const passport = require('passport');

const routes = express.Router();

routes.get("/", loginPage);
routes.post("/login", passport.authenticate('local', {failureRedirect: '/', failureFlash: true}), loginuser);
routes.get("/logout", logOutAdmin);
routes.get("/profile", passport.checkAuthenticated, profilePage);
routes.get("/change-password", passport.checkAuthenticated, changePasswordPage);
routes.post("/change-password", passport.checkAuthenticated, changePassword);

routes.get("/forgot-password", forgotPasswordPage);
routes.post("/send-otp", sendOtp);
routes.get("/verify-otp", verifyOtpPage);
routes.post("/verify-otp", verifyOtp);
routes.get("/reset-password", resetPasswordPage);
routes.post("/reset-password", resetpassword);

routes.get("/dashboard", passport.checkAuthenticated, dashboard);

routes.use("/admin", passport.checkAuthenticated, require("./admin.routes"));
routes.use("/blog", passport.checkAuthenticated, require("./blog.routes"));
routes.use("/category", passport.checkAuthenticated, require("./category.routes"));
routes.use("/subcategory", passport.checkAuthenticated, require("./subCategory.routes"));
routes.use("/extracategory", passport.checkAuthenticated, require("./extraCategory.routes"));
routes.use("/product", passport.checkAuthenticated, require("./product.routes"));

module.exports = routes;