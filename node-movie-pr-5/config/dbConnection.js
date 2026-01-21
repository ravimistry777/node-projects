const mongoose = require('mongoose')

const dbconnection = () => {
    mongoose.connect(process.env.MONGO_URI, {
        serverSelectionTimeoutMS: 5000
    })
        .then(() => {
            console.log("Data base is Connected!!!")
        })
        .catch((error) => {
            console.log("Connection Error", error)
        })
}

module.exports = dbconnection;