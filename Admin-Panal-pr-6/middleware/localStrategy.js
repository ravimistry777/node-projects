const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const Admin = require("../model/admin.model");
const bcrypt = require("bcrypt");

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
    },
    async (email, password, cb) => {

      let admin = await Admin.findOne({ email: email });
      if (!admin) {
        return cb(null, false, { message: 'Incorrect email.' });
      }
      let matchPassword = await bcrypt.compare(password, admin.password);
      if (!matchPassword) {
        return cb(null, false, { message: 'Incorrect password.' });
      }
      cb(null, admin);
    },
  ),
);


passport.serializeUser((user, cb)=> {
    cb(null, user.id)
})

passport.deserializeUser(async(id, cb)=> {
        let admin = await Admin.findById(id);
        if(admin){
            cb(null, admin);
        }
})

passport.checkAuthenticated = (req, res, next) => {
    if(req.isAuthenticated()){
      next();
    }else{
      res.redirect("/");
    }
}

passport.setAuthenticated = (req, res, next) => {
  if(req.isAuthenticated()){
      res.locals.user = req.user;
  }
  next();
}
module.exports = passport;