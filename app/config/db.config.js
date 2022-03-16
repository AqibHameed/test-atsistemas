require('dotenv').config();
USER= ''
PASSWORD=''
DB =''
if(process.env.NODE_ENV=='dev'){
  USER = process.env.DB_USER
  PASSWORD = process.env.PASSWORD
  DB =  process.env.DB
}else if(process.env.NODE_ENV=='test'){
  USER = process.env.TEST_DB_USER
  PASSWORD = process.env.TEST_DB_PASSWORD
  DB =  process.env.TEST_DB
}else if(process.env.NODE_ENV=='production'){
  USER = process.env.TEST_DB_USER
  PASSWORD = process.env.TEST_DB_PASSWORD
  DB =  process.env.TEST_DB
}

module.exports = {
    HOST: process.env.HOST,
    USER: USER,
    PASSWORD: PASSWORD,
    DB: DB,
    dialect: process.env.dialect,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
};

