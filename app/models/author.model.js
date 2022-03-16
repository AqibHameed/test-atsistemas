module.exports = (sequelize, Sequelize) => {
    const Author = sequelize.define("authors", {
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      email: {
        type: Sequelize.STRING,
        validate: {
          isEmail: true
        }
      }
    });
    return Author;
};