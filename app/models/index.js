const config = require("../config/db.config.js");
const Sequelize = require("sequelize");
const sequelize = new Sequelize(
  config.DB,
  config.USER,
  config.PASSWORD,
  {
    host: config.HOST,
    dialect: config.dialect,
    operatorsAliases: false,
    pool: {
      max: config.pool.max,
      min: config.pool.min,
      acquire: config.pool.acquire,
      idle: config.pool.idle
    }
  }
);
const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.user = require("../models/user.model.js")(sequelize, Sequelize);
db.author = require("../models/author.model.js")(sequelize, Sequelize);
db.book = require("../models/book.model.js")(sequelize, Sequelize);

db.author.belongsToMany(db.book, {
  through: "author_books",
  foreignKey: "authorId",
  otherKey: "bookId"
});
db.book.belongsToMany(db.author, {
  through: "author_books",
  foreignKey: "bookId",
  otherKey: "authorId"
});

module.exports = db;