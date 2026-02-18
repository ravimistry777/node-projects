const mongoose = require("mongoose");

const dbConnect = () => {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
        throw new Error("MONGODB_URI is not defined in environment variables");
    }
    mongoose.connect(uri)
        .then(() => console.log("Data base connected"))
        .catch(err => console.log(err));
};

module.exports = dbConnect();
