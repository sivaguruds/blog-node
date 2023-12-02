import app from './app';
import dotenv from 'dotenv';
import { logger } from './helpers/logger';
import { sequelize } from './database/connection';

dotenv.config();

const port = process.env.PORT;

sequelize
  .authenticate()
  .then(async () => {
    logger.debug('Database Connected');
  })
  .catch((err) => console.log(err));

app.listen(port, () => {
  logger.info(`Applications running on port ${port}`);
});
