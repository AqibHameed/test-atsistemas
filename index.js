const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
var auth = require('./app/routes/auth.routes')
var author = require('./app/routes/author.routes')
var book = require('./app/routes/book.routes')

const app = express();
var corsOptions = {
  origin: "http://localhost:8081"
};
app.use(cors(corsOptions));
// parse requests of content-type - application/json
app.use(bodyParser.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
const db = require("./app/models");
//sync creates the table if it doesn't exist (and does nothing if it already exists)
//db.sequelize.sync();
// routes
app.use('/api/auth', auth);
app.use('/api/authors', author);
app.use('/api/books', book);


module.exports = app