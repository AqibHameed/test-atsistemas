const { authJwt } = require("../middlewares");
const { verifyAuthor } = require("../middlewares");
const controller = require("../controllers/authors.controller");
const book = require('./book.routes');
var express = require('express');
var router = express.Router();
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })

router.get(
  "/",
  [
    authJwt.verifyToken
  ],
  controller.index
);
router.post(
    "/",
    [
      authJwt.verifyToken,
      upload.single('file')
    ],
    controller.create
  );
router.get(
  "/:authorId",
  [
    authJwt.verifyToken
  ],
  controller.show
);  
router.put(
  "/:authorId",
  [
    authJwt.verifyToken,
    verifyAuthor.checkAuthorExist
  ],
  controller.update
); 
router.delete(
  "/:authorId",
  [
    authJwt.verifyToken,
    verifyAuthor.checkAuthorExist
  ],
  controller.delete
); 
//nested the routes for books
router.use('/:authorId/books', function(req, res, next) {
    req.authorId = req.params.authorId;
    next()
  }, book);

module.exports = router;