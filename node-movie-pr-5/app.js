require('dotenv').config();
const express = require('express');
const dbconnection = require('./config/dbConnection');
const routes = require('./routes/movie.route');
const path = require('path');

const expressLayouts = require('express-ejs-layouts');

const app = express();

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(expressLayouts);
app.set('layout', 'layout'); // Point to views/layout.ejs

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Static files middleware - Yeh IMPORTANT hai!
app.use(express.static(path.join(__dirname, 'public')));

// Database connection
dbconnection();

// Routes
app.use('/', routes);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});