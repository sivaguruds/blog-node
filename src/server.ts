import app from './app';
import dotenv from 'dotenv';
import { logger } from './helpers/logger';

dotenv.config();

const port = process.env.PORT;

app.listen(port, () => {
  logger.info(`Applications running on port ${port}`);
});
