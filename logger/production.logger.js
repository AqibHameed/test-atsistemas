const {format, createLogger, transports} = require('winston');

const buildProductionLogger = createLogger({
   
    transports: [
      //
      // - Write all logs with importance level of `error` or less to `error.log`
      // - Write all logs with importance level of `info` or less to `combined.log`
      //
      new transports.File({
           filename: 'error.log',
           level: 'error',
           format: format.combine(format.timestamp(), format.json())
      }),
      new transports.File({
           filename: 'combined.log',
           level: 'info',
           format: format.combine(format.timestamp(), format.json())
      }),
    ],
  });
  const prodLog = {
    buildProductionLogger: buildProductionLogger
  };
  module.exports = prodLog