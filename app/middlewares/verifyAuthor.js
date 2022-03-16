const db = require("../models");
const Author = db.author;
checkAuthorExist = (req, res, next) => {
  // Find author by Id
  Author.findByPk(req.params.authorId)
  .then(author => {
    if (author) {
            next();
    }else{
          res.status(400).send({
            message: "Failed! author not found with id!"
          });
          return;
    }
  }).catch(err => {
    res.status(500).send({ message: err.message });
  });
};

const verifyAuthor = {
  checkAuthorExist: checkAuthorExist
};

module.exports = verifyAuthor;