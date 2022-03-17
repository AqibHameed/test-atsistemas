const dev_logger = require('./dev.logger.js');
const prod_logger  = require('./production.logger.js');
require('dotenv').config();

let logger = null;
if(process.env.NODE_ENV=='dev'){
    console.log("logger:", logger)
    logger = dev_logger.buildDevLogger
}else if(process.env.NODE_ENV=='production'){
    logger = prod_logger.buildProductionLogger
}  
logger = dev_logger.buildDevLogger  

module.exports = logger;