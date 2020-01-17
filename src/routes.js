import { Router } from 'express';

import multer from 'multer';
import multerConfigs from './config/multer';

/**
 * Controller
 */
import UserController from './app/controllers/User/UserController';
import SessionController from './app/controllers/Session/SessionController';
import FileController from './app/controllers/File/FileController';

/**
 * Middleware
 */
import authMiddleware from './app/middlewares/auth';

const routes = new Router();
const upload = multer(multerConfigs);

routes.get('/', (req, res) => {
  return res.json({ message: 'goBarberApi' });
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

// upload test
routes.post('/files', upload.single('file'), FileController.store);

export default routes;
