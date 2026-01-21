const express = require('express');
const { homepage, addmoviespage, addMovie, deleteMovie, editMovie, updateMovie, searchMovies, sortMovies, getMovieDetails
} = require('../controller/movie.controller');
const upload = require('../middleware/upload.middleware');

const routes = express.Router();

routes.get('/', homepage);
routes.get('/addmovies', addmoviespage);
routes.post('/add-movie', upload.single('movieImage'), addMovie);
routes.get('/delete-movie/:id', deleteMovie);
routes.get('/edit-movie/:id', editMovie);
routes.get('/movie/:id', getMovieDetails);
routes.post('/update-movie/:id', upload.single('movieImage'), updateMovie);
routes.get('/search', searchMovies);
routes.get('/sort', sortMovies);

module.exports = routes;