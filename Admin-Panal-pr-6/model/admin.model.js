const mongoose = require('mongoose');

const adminSchema = mongoose.Schema({
    firstname: {
        type: String
    },
    lastname: {
        type: String
    },
    email: {
        type: String
    },
    password: {
        type: String
    },
    gender: {
        type: String,
        enum: ['Male', 'Female']
    },
    mobileNo: {
        type: String
    },
    profileImage: {
        type: String
    },
    city: {
        type: String
    }
});


module.exports = mongoose.model('Admin', adminSchema);