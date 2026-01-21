const mongoose = require('mongoose')

const movieSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    director: {
        type: String,
        required: true
    },
    genre: {
        type: String,
        required: true
    },
    year: {
        type: Number,
        required: true
    },
    rating: {
        type: Number,
        min: 0,
        max: 10
    },
    description: {
        type: String
    },
    movieImage: {
        type: String
    }
}, {
    bufferCommands: false,
    timestamps: true
})

module.exports = mongoose.models.Movie || mongoose.model('Movie', movieSchema)