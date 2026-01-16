require('dotenv').config();
const express = require('express');
const dbconnection = require('./config/dbConnection');
const routes = require('./routes/book.route');

const app = express();

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));

dbconnection();
app.use('/', routes);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
