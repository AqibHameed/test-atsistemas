const db = require("../models");
const Book = db.book
const Author = db.author
const csv = require('csv-parser');
const fs = require('fs');
exports.index = (req, res) => {
    // find Author on the basis of the Id
    Author.findByPk(req.authorId)
    .then(author => {
          if(author) {
              // Fetch all Books from Database
              author.getBooks()
                .then(books => {
                  res.status(200).send({
                      books: books
                  }); 
                })
                .catch(err => {
                  res.status(500).send({ message: err.message });
                });           
          }else{
            return res.status(404).send({
                message: "author not found with id " + req.params.authorId
            });

          } 
        
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
  
  };

exports.create =  (req, res) => {

  const stream = fs.createReadStream(req.file.path)
          .pipe(csv())
          .on('data', async (row) => {
              //pause the stream
              stream.pause();
              Book.findOne({
                where: {
                  name: row.Book
                }
              })
              .then(book => {
                    if (!book) {
                      Book.create({name: row.Book})
                      stream.resume();
                    }else{
                      stream.resume();
                    }
              })
              .catch(err => {
                res.status(500).send({ message: err.message });
              });
          })
          .on('end', () => {  
              res.status(201).send({ message: "Books are created successfully!"})
          });
};

exports.show = (req, res) => {
    // find Book on the basis of the Id
    Book.findByPk(req.params.bookId)
      .then(book => {
            if(!book) {
                return res.status(404).send({
                    message: "book not found with id " + req.params.bookId
                });            
            }
            book.getAuthors()
               .then(authors =>{
                     res.send({ book: book, authors:  authors  });
                })
                .catch(err => {
                     res.status(500).send({ message: err.message });
                }); 
      })
      .catch(err => {
        res.status(500).send({ message: err.message });
      });
  };

  exports.update = (req, res) => {
    // update Book on the basis of the Id
    if(!req.body.name) {
        return res.status(400).send({
            message: "Book name can not be empty"
        });
    }
    Book.findByPk(req.params.bookId)
      .then(book => {
            if(!book) {
                return res.status(404).send({
                    message: "Book not found with id " + req.params.bookId
                });            
            }
            book.update({ name: req.body.name })
                .then(function() {
                        console.log(req.body.authorIds)
                        if(req.body.authorIds){
                            book.setAuthors(req.body.authorIds).then(() => {
                                res.send({ message: "Book and its authors relationships are updated successfully" });
                              });
              
                        }else{
                           res.send({ message: "Book is updated successfully!" });
                        }
                        //res.send({ message: "Book is updated successfully!" });
                })
                .catch(err => {
                    res.status(500).send({ message: err.message });
                }); 
      })
      .catch(err => {
        res.status(500).send({ message: err.message });
      });
    
    
  };
  exports.delete = (req, res) => {
    // delete book on the basis of the Id
    Book.destroy({ 
      where: {
          id: req.params.bookId
      }
    })
    .then(function() {
            res.send({ message: "Book is deleted successfully!" });
    })
    .catch(err => {
        res.status(500).send({ message: err.message });
    });
  };
