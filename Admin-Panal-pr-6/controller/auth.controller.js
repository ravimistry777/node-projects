const Admin = require('../model/admin.model');
const Category = require('../model/category.model');
const SubCategory = require('../model/subCategory.model');
const ExtraCategory = require('../model/extraCategory.model');
const Product = require('../model/product.model');
const bcrypt = require('bcrypt');
const otpGenerator = require('otp-generator');
const sendEmail = require("../middleware/sendEmail");

exports.loginPage = async(req,res) => {
    try {
        if(req.isAuthenticated())
            return res.redirect("/dashboard");
        else{
            return res.render("login");
        }
    } catch (error) {
        console.log(error);
        return res.redirect("/");
    }
}

exports.logOutAdmin = async(req,res, next) => {
    try {
        req.logout((err) => {
            if (err) {
                console.log(err);
                return next(err);
            }
            req.flash('success', 'Logout Successfully');
            return res.redirect("/");
        });
    } catch (error) {
        console.log(error);
        return res.redirect("/dashboard");
    }
}

exports.profilePage = async(req,res) => {
    try {
        const user = req.user;
        return res.render("profile" , {user});
    } catch (error) {
        console.log(error);
        return res.redirect("/dashboard");
    }
}

exports.changePasswordPage = async(req,res) => {
    try {
        const user = req.user;
        return res.render("changepassword", {user});
    } catch (error) {
        console.log(error);
        return res.redirect("/dashboard");
    }
}

exports.changePassword = async (req, res) => {
    try {
            const user = req.user;
            const {oldPass, newPassword, confirmPassword} = req.body;
            let matchpass = await bcrypt.compare(oldPass, user.password);
            if(!matchpass){
                req.flash('error', 'Wrong Old Password');
                return res.redirect("/change-password");
            }

            if(oldPass == newPassword){
                req.flash('error', 'Old and New Password cannot be same');
                return res.redirect("/change-password");
            }
            if(newPassword != confirmPassword){
                req.flash('error', 'New password and confirm password do not match');
                return res.redirect("/change-password");
            }

            const hashpassword = await bcrypt.hash(newPassword, 10);
            await Admin.findByIdAndUpdate(user._id, {password: hashpassword}, {new: true});
            req.flash('success', 'Change password Success');
            return res.redirect("/dashboard");
    } catch (error) {
        console.log(error);
        return res.redirect("/dashboard");
    }
}

exports.loginuser = async (req, res) => {
    try {
        req.flash('success', 'Login Success');
        return res.redirect("/dashboard");
    } catch (error) {
        console.log(error);
        return res.redirect("/");
    }
}

exports.forgotPasswordPage = async (req, res) => {
    try {
        return res.render("resetpass/forgotpassword");
    } catch (error) {
        console.log(error);
        return res.redirect("/dashboard");
    }
}

exports.verifyOtpPage = async (req, res) => {
    try {
        
        return res.render("resetpass/verifyOtp");
    } catch (error) {
        console.log(error);
        return res.redirect("/dashboard");
    }
}

exports.resetPasswordPage = async (req, res) => {
    try {
        
        return res.render("resetpass/resetPassword");
    } catch (error) {
        console.log(error);
        return res.redirect("/dashboard");
    }
}

exports.sendOtp = async (req, res) => {
    try {
        const admin = await Admin.findOne({email: req.body.email});
        if(!admin){
            console.log('ADMIN NOT FOUND');
            return res.redirect("/forgot-password");
        }
        let otp = otpGenerator.generate(6, {upperCaseAlphabets: false, lowerCaseAlphabets: false, specialChars: false});
        
        let message = {
            from: 'sq.ravi777@gmail.com',
            to: `${req.body.email}`,
            subject: "Reset password OTP.",
            html: `<h2>Hello, ${admin.firstname}</h2>
                <p>Your Reset password OTP is : ${otp}.</p>`
        }
        await sendEmail(message);
        res.cookie('otp', otp);
        res.cookie('email', admin.email);
        req.flash('success', 'OTP sent to your email');
        return res.redirect("/verify-otp");
    } catch (error) {
        console.log(error);
        return res.redirect("/dashboard");
    }
}
exports.verifyOtp = async (req, res) => {
    try {
        let otp = req.cookies.otp;

        if(otp != req.body.otp){
            console.log('Otp not matched!!!!!');
            req.flash('error', 'Invalid OTP');
            return res.redirect("/verify-otp");
        }
        res.clearCookie('otp');
        req.flash('success', 'OTP Verified');
        return res.redirect("/reset-password");
    } catch (error) {
        console.log(error);
        return res.redirect("/dashboard");
    }
}

exports.resetpassword = async (req, res) => {
    try {
        let email = req.cookies.email;
        if(req.body.newPassword != req.body.confirmPassword){
            console.log('Password is not matched');
            req.flash('error', 'Passwords do not match');
            return res.redirect("/reset-password");
        }

        let hashpassword = await bcrypt.hash(req.body.newPassword, 10);

        await Admin.findOneAndUpdate({email: email}, {password: hashpassword}, {new: true});
        res.clearCookie('email');
        req.flash('success', 'Password Reset Successfully');
        return res.redirect("/");
        
    } catch (error) {
        console.log(error);
        return res.redirect("/dashboard");
    }
}

exports.dashboard = async (req, res) => {
    try {
        const totalAdmin = await Admin.countDocuments();
        const totalCategory = await Category.countDocuments();
        const totalSubCategory = await SubCategory.countDocuments();
        const totalExtraCategory = await ExtraCategory.countDocuments();
        const totalProduct = await Product.countDocuments();
        
        // Fetch recent 5 products for the dashboard table
        const recentProducts = await Product.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .populate('categoryId')
            .populate('subCategoryId')
            .populate('extraCategoryId');

        return res.render("dashboard", {
            totalAdmin, 
            totalCategory,
            totalSubCategory,
            totalExtraCategory,
            totalProduct,
            recentProducts
        });
    } catch (error) {
        console.log(error);
        return res.redirect("/");
    }
}
