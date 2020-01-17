import { Router } from 'express';

import UserController from './app/controllers/User/UserController';
import SessionController from './app/controllers/Session/SessionController';
import authMiddleware from './app/middlewares/auth';

const routes = new Router();

routes.get('/', (req, res) => {
  return res.json({ message: 'Hello word' });
});

/**
 * Store user and login  - No middleware
 */
routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);

/**
 * Authenticate routes with middleware
 */
routes.use(authMiddleware);
routes.put('/users', authMiddleware, UserController.update);

export default routes;
