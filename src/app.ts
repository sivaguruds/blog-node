import express, { Express, NextFunction, Request, Response } from 'express';
import cors from 'cors';
import httpStatus from 'http-status';
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';
import ApiError from './helpers/ApiError';
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

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Blog management Express API with Swagger',
      version: '1.0.0',
      description: 'This is a blog management API application made with Express and documented with Swagger',
      license: {
        name: 'MIT',
        url: 'https://spdx.org/licenses/MIT.html',
      },
      contact: {
        name: 'sivaguru',
        url: '',
        email: 'sivaguruds@gmail.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:5000/api',
      },
    ],
  },
  apis: ['./src/routes/*.ts'],
};

const specs = swaggerJSDoc(options);

app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(specs, {
    explorer: true,
    // customCssUrl: 'https://cdn.jsdelivr.net/npm/swagger-ui-themes@3.0.0/themes/3.x/theme-newspaper.css',
  }),
);

// send back a 404 error for any unknown api request
app.use((req: Request, res: Response, next: NextFunction) => {
  next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
});

// convert error to ApiError, if needed
app.use(errorConverter);
// handle error
app.use(errorHandler);

export default app;
