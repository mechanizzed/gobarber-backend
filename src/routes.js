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
import AvailableController from './app/controllers/Available/AvailableController';

/**
 * Validators
 */
import ValidateSessionStore from './app/validators/session/SessionStore';
import ValidateUserStore from './app/validators/user/UserStore';
import ValidateUserUpdate from './app/validators/user/UserUpdate';
import ValidateAppointmentStore from './app/validators/appointment/AppointmentStore';

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
routes.post('/users', ValidateUserStore, UserController.store);
routes.post('/sessions', ValidateSessionStore, SessionController.store);

/**
 * Authenticate routes with middleware
 */
routes.use(authMiddleware);
routes.put('/users', ValidateUserUpdate, UserController.update);

/**
 * Providers
 */
routes.get('/providers', ProviderController.index);
routes.get('/providers/:providerId/available', AvailableController.index);

/**
 * Appointments
 */
routes.get('/appointments', AppointmentController.index);
routes.post(
  '/appointments',
  ValidateAppointmentStore,
  AppointmentController.store
);
routes.delete('/appointments/:id', AppointmentController.delete);

/**
 * Schedules - List schedules fro providers
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
