const mongoose = require('mongoose');

const dbConnect = () => {
    mongoose.connect('mongodb+srv://sqravi777_db_user:7069695001%40Ravi@cluster0.usosjrr.mongodb.net/role-based')
    .then(()=>console.log('Database connected'))
    .catch((err) => console.log(err))
}

module.exports = dbConnect;