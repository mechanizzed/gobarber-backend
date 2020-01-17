import { Router } from 'express';

import UserController from './app/controllers/User/UserController';

const routes = new Router();

routes.get('/', (req, res) => {
  return res.json({ message: 'Hello word' });
});

/**
 * User
 */
routes.post('/users', UserController.store);

export default routes;
