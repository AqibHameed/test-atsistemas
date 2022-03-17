const app = require('./index')
const PORT = process.env.PORT || 8080;
const logger = require('./logger')

app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}.`);
});