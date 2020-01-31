import { isBefore, subHours } from 'date-fns';
import User from '../../models/User/User';
import File from '../../models/File/File';
import Appointment from '../../models/Appointment/Appointment';

// Queue Redis Utils and Jobs
import CanceledMail from '../../jobs/Email/CanceledMail';
import Queue from '../../../utils/Queue';

// Services

import CreateAppointmentService from '../../services/appointment/CreateAppointmentService';

class AppointmentController {
  /**
   * List appointments for providers
   */
  async index(req, res) {
    const { page = 1 } = req.query;

    const appointments = await Appointment.findAll({
      where: { user_id: req.userId, canceled_at: null },
      order: ['date'],
      limit: 20,
      offset: (page - 1) * 20,
      attributes: ['id', 'date', 'past', 'cancelable', 'createdAt'],
      include: [
        {
          model: User,
          as: 'provider',
          attributes: ['id', 'name'],
          include: [
            {
              model: File,
              as: 'avatar',
              attributes: ['id', 'path', 'url'],
            },
          ],
        },
      ],
    });

    return res.json(appointments);
  }

  /**
   * Store new appointment
   */
  async store(req, res) {
    const { provider_id, date } = req.body;

    const appointment = await CreateAppointmentService.run({
      provider_id,
      user_id: req.userId,
      date,
    });

    return res.json(appointment);
  }

  /**
   * Canceled appointment
   */
  async delete(req, res) {
    const appointment = await Appointment.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'provider',
          attributes: ['name', 'email'],
        },
        {
          model: User,
          as: 'user',
          attributes: ['name'],
        },
      ],
    });
    if (appointment.user_id !== req.userId) {
      return res.status(401).json({
        error: 'Você não pode cancelar um agendamento de outro usuário.',
      });
    }

    const dateSub = subHours(appointment.date, 2);
    if (isBefore(dateSub, new Date())) {
      return res.status(401).json({
        error:
          'Você só pode fazer um cancelamento em um limite de 2 horas antes da data agendada',
      });
    }

    appointment.canceled_at = new Date();
    appointment.save();

    // send new job for canceled mail
    await Queue.add(CanceledMail.key, {
      appointment,
    });

    return res.json(appointment);
  }
}

export default new AppointmentController();
