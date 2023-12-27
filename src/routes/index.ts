import { Router, Request, Response } from 'express';
import authRoute from './auth';

const router = Router();

const defaultRoute = [
  {
    path: '/auth',
    route: authRoute,
  },
];

defaultRoute.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
