const mongoose = require('mongoose')

const dbconnection = () => {
    mongoose.connect('mongodb+srv://sqravi777_db_user:7069695001%40Ravi@cluster0.usosjrr.mongodb.net/', {
        serverSelectionTimeoutMS: 5000
    })
        .then(() => {
            console.log("Data base is Connected!!!")
        })
        .catch((error) => {
            console.log("Connection Error", error)
        })
}

module.exports = dbconnection