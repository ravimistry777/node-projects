const MovieModel = require('../model/movie.model');
const fs = require('fs');
const path = require('path');

exports.homepage = async (req, res) => {
    try {
        let movies = await MovieModel.find().sort({ createdAt: -1 });
        res.render('home', { movies });
    } catch (error) {
        console.log(error);
        res.status(500).send("Movie Data doesn't fetched kindly check the database connection");
    }
}

exports.addmoviespage = async (req, res) => {
    res.render('addMovie');
}

exports.addMovie = async (req, res) => {
    try {
        const movieData = { ...req.body };
        if (req.file) {
            movieData.movieImage = `/uploads/${req.file.filename}`;
        }
        await MovieModel.create(movieData);
        res.redirect('/');
    } catch (error) {
        console.log(error);
        res.render('addMovie', { error: "Failed to add movie" });
    }
}

exports.deleteMovie = async (req, res) => {
    let id = req.params.id;
    try {
        const movie = await MovieModel.findById(id);
        if (movie && movie.movieImage) {
            const imagePath = path.join(__dirname, '../public', movie.movieImage);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }
        await MovieModel.findByIdAndDelete(id);
        res.redirect('/');
    } catch (error) {
        console.log(error);
        res.redirect('/');
    }
}

exports.editMovie = async (req, res) => {
    let id = req.params.id;
    try {
        let movie = await MovieModel.findById(id);
        res.render("editMovie", { movie });
    } catch (error) {
        console.log(error);
        res.redirect('/');
    }
}

exports.updateMovie = async (req, res) => {
    let id = req.params.id;
    try {
        const movie = await MovieModel.findById(id);
        const movieData = { ...req.body };

        if (req.file) {
            // Delete old image if new one is uploaded
            if (movie.movieImage) {
                const oldPath = path.join(__dirname, '../public', movie.movieImage);
                if (fs.existsSync(oldPath)) {
                    fs.unlinkSync(oldPath);
                }
            }
            movieData.movieImage = `/uploads/${req.file.filename}`;
        }

        await MovieModel.findByIdAndUpdate(id, movieData, { new: true });
        res.redirect('/');
    } catch (error) {
        console.log(error);
        res.redirect('/');
    }
}

// search functionality
exports.searchMovies = async (req, res) => {
    try {
        const { query } = req.query;
        let movies;

        if (query) {
            movies = await MovieModel.find({
                $or: [
                    { title: { $regex: query, $options: 'i' } },
                    { director: { $regex: query, $options: 'i' } },
                    { genre: { $regex: query, $options: 'i' } }
                ]
            });
        } else {
            movies = await MovieModel.find();
        }

        res.render('home', { movies, searchQuery: query });
    } catch (error) {
        console.log(error);
        res.redirect('/');
    }
}

// sorting functionality
exports.sortMovies = async (req, res) => {
    try {
        const { sortBy } = req.query;
        let sortOption = {};

        switch (sortBy) {
            case 'title':
                sortOption = { title: 1 };
                break;
            case 'year':
                sortOption = { year: -1 };
                break;
            case 'rating':
                sortOption = { rating: -1 };
                break;
            case 'recent':
            default:
                sortOption = { createdAt: -1 };
        }

        let movies = await MovieModel.find().sort(sortOption);
        res.render('home', { movies, currentSort: sortBy });
    } catch (error) {
        console.log(error);
        res.redirect('/');
    }
}

// movie details page
exports.getMovieDetails = async (req, res) => {
    let id = req.params.id;
    try {
        let movie = await MovieModel.findById(id);
        if (!movie) {
            return res.redirect('/');
        }
        res.render("movieDetails", { movie });
    } catch (error) {
        console.log(error);
        res.redirect('/');
    }
}
