const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    firstname: String,
    lastname: String,
    email: String,
    password: String,
    mobileNo: String,
    profileImage: String,
    role: {
        type: String,
        enum: ['Admin', 'Manager', 'Employee'],
        default: 'Admin'
    },
    isDelete: {
        type: Boolean,
        default: false
    }
}, {
    versionKey: false,
    timestamps: true
})

module.exports = mongoose.model('users', userSchema)