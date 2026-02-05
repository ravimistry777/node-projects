const express = require('express');
const dbConnect = require('./config/dbConnect');
const cookieparser = require('cookie-parser');
const passport = require('passport');
const localStrategy = require('./middleware/localStrategy');
const session = require('express-session');
const flash = require('connect-flash');
const flashMessage = require('./middleware/flashMessage');

const app = express();
const port = 8888;

// Middleware
app.set('view engine', 'ejs');
app.use(express.urlencoded());
app.use(express.static('public'));
app.use("/uploads",express.static('uploads'));
app.use(cookieparser());
app.use(flash());

app.use(session({
    name: 'node-9AM',
    secret: 'develop',
    saveUninitialized: false,
    resave: true,
    cookie: {
        maxAge: 1000 * 60 * 60
    }
}))

app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthenticated);
app.use(flashMessage);

app.use((req, res, next) => {
    res.locals.path = req.path;
    next();
});

app.use("/", require('./routes/index.routes'));


app.listen(port, ()=> {
    console.log(`Server start at http://localhost:${port}/dashboard`);
})