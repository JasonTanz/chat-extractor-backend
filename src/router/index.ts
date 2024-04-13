import express from 'express';
import chatRoute from './chat.route';

export const router = express.Router();

// Default routes
const defaultRoutes = [
  {
    path: '/chat',
    route: chatRoute,
  },
];

// Routes
defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
