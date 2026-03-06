const express = require("express");
require('dotenv').config();
const port = 8888;
const app = express();
const dbConnect = require("./config/dbConnect");
const morgan = require('morgan');
const cors = require('cors');

//DB Connection
dbConnect();

//middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/uploads", express.static('src/uploads'));


//routes
app.use("/api", require("./routes/index.routes"));



app.listen(port, () => {
  console.log(`Server start at http://localhost:${port}`);
});