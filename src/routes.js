import { Router } from 'express';

import UserController from './app/controllers/User/UserController';
import SessionController from './app/controllers/Session/SessionController';

const routes = new Router();

routes.get('/', (req, res) => {
  return res.json({ message: 'Hello word' });
});

/**
 * User
 */
routes.post('/users', UserController.store);

/**
 * Sessions
 */
routes.post('/sessions', SessionController.store);

export default routes;
