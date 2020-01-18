import { startOfDay, endOfDay, parseISO } from 'date-fns';
import { Op } from 'sequelize';
import User from '../../models/User/User';
import Appointment from '../../models/Appointment/Appointment';

class ScheduleController {
  /**
   * List schedules
   */
  async index(req, res) {
    const checkIsProvider = await User.findOne({
      where: { id: req.userId, provider: true },
    });

    if (!checkIsProvider) {
      return res
        .status(401)
        .json({ error: 'Você não é um prestador de serviço' });
    }

    // 2020-01-18 00:00:00
    // 2020-01-18 23:59:59
    const { date } = req.query;
    const dateParse = parseISO(date);

    const appointments = await Appointment.findAll({
      where: {
        provider_id: req.userId,
        canceled_at: null,
        date: {
          [Op.between]: [startOfDay(dateParse), endOfDay(dateParse)],
        },
      },
      order: ['date'],
    });

    return res.json(appointments);
  }
}

export default new ScheduleController();
