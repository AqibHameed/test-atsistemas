const db = require("../models");
const Book = db.book
const Author = db.author
const csv = require('csv-parser');
const fs = require('fs');
const logger = require('../../logger')
exports.index = (req, res) => {
    // Fetch all authors
    Author.findAll()
      .then(authors => {
          res.status(200).send({
            authors: authors
        }); 
      }).catch(err => {
        res.status(500).send({ message: err.message });
        logger.error(err.message);
      });

  };

exports.create =  (req, res) => {
  const stream = fs.createReadStream (req.file.path)
          .pipe(csv())
          .on('data', (row) => {
              //pause the stream
              stream.pause();
              //Find the author if exist
              Author.findOne({
                    where: {
                      name: row.Author
                    }
                  })
                  .then(author => {
                        if (!author) {
                          Author.create({name: row.Author, email: row.Email});
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
              res.status(201).send({ message: "Authors are created successfully!"});   
              logger.info('Authors are created successfully!');
            });

};

exports.show = (req, res) => {
    // find Author on the basis of the Id
    Author.findByPk(req.params.authorId)
      .then(author => {
            if(!author) {
                return res.status(404).send({
                    message: "author not found with id " + req.params.authorId
                });            
            }
            author.getBooks()
               .then(books =>{
                     res.send({ author: author, books:  books  });
                })
                .catch(err => {
                     res.status(500).send({ message: err.message });
                     logger.error(err.message);
                });
      })
      .catch(err => {
        res.status(500).send({ message: err.message });
        logger.error(err.message);
      });
  };

  exports.update = (req, res) => {
    // update Auhor on the basis of the Id
    if(!req.body.name) {
        return res.status(400).send({
            message: "Author name can not be empty"
        });
    }
    Author.findByPk(req.params.authorId)
      .then(author => {
            if(!author) {
                return res.status(404).send({
                    message: "Author not found with id " + req.params.authorId
                });            
            }
            author.update({ name: req.body.name, email: req.body.email })
                .then(function() {
                        if(req.body.bookIds){
                            author.setBooks([req.body.bookIds]).then(() => {
                                res.send({ message: "Author and its book relationships are updated successfully" });
                                logger.info('Author and its book relationships are updated successfully');
                              });
                        }else{
                             res.send({ message: "Author is updated successfully!" });
                             logger.info('Author is updated successfully!');
                        }
                        
                })
                .catch(err => {
                    res.status(500).send({ message: err.message });
                    logger.error(err.message);
                }); 
      })
      .catch(err => {
        res.status(500).send({ message: err.message });
        logger.error(err.message);
      });
    
  };
  exports.delete = (req, res) => {
    // delete Author on the basis of the Id
    Author.destroy({ 
      where: {
          id: req.params.authorId
      }
    })
    .then(function() {
            res.send({ message: "Author is deleted successfully!" });
            logger.info('Author is deleted successfully!');
    })
    .catch(err => {
        res.status(500).send({ message: err.message });
        logger.error(err.message);
    });
  };
