import { Router, Request, Response } from 'express';
import authRoute from './auth';
import category from './category';
import tag from './tag';
import upload from './upload';

const router = Router();

const defaultRoute = [
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/category',
    route: category,
  },
  {
    path: '/tag',
    route: tag,
  },
  {
    path: '/upload',
    route: upload,
  },
];

defaultRoute.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
