const mongoose = require('mongoose')

const bookSchema = mongoose.Schema({
    title: {
        type: String
    },
    author: {
        type: String
    },
    category: {
        type: String
    },
    price: {
        type: String
    },
    bookImage: {
        type: String
    }
}, {
    bufferCommands: false,
    timestamps: true
})


module.exports = mongoose.models.Books || mongoose.model('Books', bookSchema)