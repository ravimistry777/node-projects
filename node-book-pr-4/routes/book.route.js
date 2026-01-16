const express = require('express')
const { homepage, addbookspage, addbook, deleteBook, editBook, updateBook } = require('../controller/book.controller')
const routes = express.Router()

routes.get('/',homepage)
routes.get('/addbooks',addbookspage)
routes.post('/add-book',addbook)
routes.get('/delete-book/:id',deleteBook)
routes.get('/edit-book/:id',editBook)
routes.post('/update-book/:id',updateBook)
module.exports = routes