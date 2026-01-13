const express = require('express');
const dbconnection = require('./config/dbConnection');
const routes = require('./routes/book.route');

const app = express()
const port = 8000;

app.set('view engine', "ejs")
app.use(express.urlencoded({ extended: true }))

dbconnection()
app.use('/', routes)

app.listen(port, () => {
    console.log(`server start at http://localhost:${port}`)
})