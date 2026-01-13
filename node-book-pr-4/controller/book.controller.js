const bookModel = require('../model/book.model');

exports.homepage = async (req, res) => {
   try {
      let books = await bookModel.find()
      res.render('home', { books })
   } catch (error) {
      console.log(error)
      res.status(500).send("Book Data dosent fetched kindly check the database connection");
   }
}


exports.addbookspage = async (req, res) => {
   res.render('addBook')
}


exports.addbook = async (req, res) => {
   try {
      await bookModel.create(req.body)
      res.redirect('/')
   } catch (error) {
      console.log(error)
   }
}


exports.deleteBook = async (req, res) => {
   let id = req.params.id
   try {

      await bookModel.findByIdAndDelete(id)
      res.redirect('/')
   } catch (error) {
      console.log(error)
      res.redirect('/')

   }
}

exports.editBook = async (req, res) => {
   let id = req.params.id

   try {
      let book = await bookModel.findById(id)
      res.render("editBook", { book })
   } catch (error) {
      console.log(error)
      res.redirect('/')

   }
}


exports.updateBook = async (req, res) => {
   let id = req.params.id
   try {
      await bookModel.findByIdAndUpdate(id, req.body, { new: true })
      res.redirect('/')
   } catch (error) {
      console.log(error)
      res.redirect('/')

   }
}