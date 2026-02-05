const mongoose = require("mongoose");

const dbConnect = () => {
    mongoose.connect("mongodb+srv://sqravi777_db_user:7069695001%40Ravi@cluster0.usosjrr.mongodb.net/adminpanal")
    .then(() => console.log("Data base connected"))
    .catch(err => console.log(err));
}

module.exports = dbConnect();