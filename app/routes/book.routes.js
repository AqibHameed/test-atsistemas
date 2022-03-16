const { authJwt } = require("../middlewares");
const { verifyBook } = require("../middlewares");
const controller = require("../controllers/books.controller");
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
  "/:bookId",
  [
    authJwt.verifyToken
  ],
  controller.show
);  
router.put(
  "/:bookId",
  [
    authJwt.verifyToken,
    verifyBook.checkBookExist
  ],
  controller.update
); 
router.delete(
  "/:bookId",
  [
    authJwt.verifyToken,
    verifyBook.checkBookExist
  ],
  controller.delete
); 

module.exports = router;