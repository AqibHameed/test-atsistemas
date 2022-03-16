const db = require("../models");
const Book = db.book;
checkBookExist = (req, res, next) => {
  // Find book by Id
  Book.findByPk(req.params.bookId)
  .then(book => {
      if (book) {
              next();
      }else{
            res.status(400).send({
              message: "Failed! book not found with id!"
            });
            return;
      }
  }).catch(err => {
    res.status(500).send({ message: err.message });
  });
};

const verifyBook = {
  checkBookExist: checkBookExist
};

module.exports = verifyBook;