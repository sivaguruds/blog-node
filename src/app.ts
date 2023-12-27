import express, { Express, NextFunction, Request, Response } from 'express';
import cors from 'cors';
import ApiError from './helpers/ApiError';
import httpStatus from 'http-status';
import { errorConverter, errorHandler } from './middlewares/error';

// API routes:
import routes from './routes/index';

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.json({ type: 'application/vnd.api+json' }));
app.use(cors());

app.get('/api/test', async (req, res) => {
  res.status(200).send('Congratulations!Typescript API is working!');
});

app.use('/api', routes);

// send back a 404 error for any unknown api request
app.use((req: Request, res: Response, next: NextFunction) => {
  next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
});

// convert error to ApiError, if needed
app.use(errorConverter);
// handle error
app.use(errorHandler);

export default app;
