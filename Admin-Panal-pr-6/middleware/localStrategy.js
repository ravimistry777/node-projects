const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const Admin = require("../model/admin.model");
const User = require("../model/user.model");
const bcrypt = require("bcrypt");

// Admin Strategy
passport.use('admin-local',
  new LocalStrategy(
    { usernameField: "email" },
    async (email, password, cb) => {
      try {
        let admin = await Admin.findOne({ email: email });
        if (!admin) return cb(null, false, { message: 'Incorrect email.' });
        let matchPassword = await bcrypt.compare(password, admin.password);
        if (!matchPassword) return cb(null, false, { message: 'Incorrect password.' });
        admin.role = 'admin'; // Mark as admin for deserialization
        return cb(null, admin);
      } catch (err) { return cb(err); }
    },
  ),
);

// User (Customer) Strategy
passport.use('user-local',
  new LocalStrategy(
    { usernameField: "email" },
    async (email, password, cb) => {
      try {
        let user = await User.findOne({ email: email });
        if (!user) return cb(null, false, { message: 'Incorrect email.' });
        let matchPassword = await bcrypt.compare(password, user.password);
        if (!matchPassword) return cb(null, false, { message: 'Incorrect password.' });
        user.role = 'customer'; // Mark as customer
        return cb(null, user);
      } catch (err) { return cb(err); }
    },
  ),
);

passport.serializeUser((user, cb)=> {
    cb(null, { id: user.id, role: user.role });
})

passport.deserializeUser(async(data, cb)=> {
    try {
        if (data.role === 'admin') {
            let admin = await Admin.findById(data.id);
            if (admin) {
                admin.role = 'admin';
                return cb(null, admin);
            }
        } else {
            let user = await User.findById(data.id);
            if (user) {
                user.role = 'customer';
                return cb(null, user);
            }
        }
        cb(null, false);
    } catch (err) { cb(err); }
})

passport.checkAdmin = (req, res, next) => {
    if(req.isAuthenticated()){
        if(req.user.role === 'admin'){
            return next();
        } else {
            req.flash('error', 'Customers cannot access Admin Panel');
            return res.redirect("/admin");
        }
    } else {
        return res.redirect("/admin");
    }
}

passport.checkCustomer = (req, res, next) => {
    if(req.isAuthenticated()){
        if(req.user.role === 'customer'){
            return next();
        } else {
            req.flash('error', 'Admins should use Admin Panel');
            return res.redirect("/login");
        }
    } else {
        return res.redirect("/login");
    }
}

passport.setAuthenticated = (req, res, next) => {
  if(req.isAuthenticated()){
      res.locals.user = req.user;
  }
  next();
}
module.exports = passport;