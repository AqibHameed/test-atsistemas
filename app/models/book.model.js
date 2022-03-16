module.exports = (sequelize, Sequelize) => {
  const Book = sequelize.define("books", {
    name: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
    }
  });
  return Book;
};