import { Router } from 'express';

import multer from 'multer';
import multerConfigs from './config/multer';

/**
 * Controller
 */
import UserController from './app/controllers/User/UserController';
import SessionController from './app/controllers/Session/SessionController';
import FileController from './app/controllers/File/FileController';
import ProviderController from './app/controllers/Provider/ProviderController';
import AppointmentController from './app/controllers/Appointment/AppointmentController';
import ScheduleController from './app/controllers/Schedule/ScheduleController';
import NotificationController from './app/controllers/Notification/NotificationController';

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

/**
 * Providers
 */
routes.get('/providers', ProviderController.index);

/**
 * Appointments
 */
routes.get('/appointments', AppointmentController.index);
routes.post('/appointments', AppointmentController.store);
routes.delete('/appointments/:id', AppointmentController.delete);

/**
 * Schedules
 */
routes.get('/schedules', ScheduleController.index);

/**
 * Notifications
 */
routes.get('/notifications', NotificationController.index);
routes.put('/notifications/:id', NotificationController.update);

/**
 * Upload files
 */
routes.post('/files', upload.single('file'), FileController.store);

export default routes;
