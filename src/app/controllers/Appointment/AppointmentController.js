import * as Yup from 'yup';
import { startOfHour, parseISO, isBefore, format } from 'date-fns';
import pt from 'date-fns/locale/pt';
import User from '../../models/User/User';
import File from '../../models/File/File';
import Appointment from '../../models/Appointment/Appointment';

// NotificationSchema Mongo
import Notification from '../../schemas/Notification';

class AppointmentController {
  /**
   * List appointments
   */
  async index(req, res) {
    const { page = 1 } = req.query;

    const appointments = await Appointment.findAll({
      where: { user_id: req.userId, canceled_at: null },
      order: ['date'],
      limit: 20,
      offset: (page - 1) * 20,
      attributes: ['id', 'date', 'createdAt'],
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
    const schema = Yup.object().shape({
      provider_id: Yup.number().required(),
      date: Yup.date().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res
        .status(400)
        .json({ error: 'Preencha todos os campos corretamente' });
    }

    const { provider_id, date } = req.body;

    // check if provider_id is a provider
    const idProvider = await User.findOne({
      where: { id: provider_id, provider: true },
    });
    if (!idProvider) {
      return res.status(401).json({
        error: 'Você só pode criar agendamentos com um provedor de serviços',
      });
    }

    /**
     * Check past date
     */
    const hourStart = startOfHour(parseISO(date));
    if (isBefore(hourStart, new Date())) {
      return res.status(400).json({ error: 'Data inválida' });
    }

    /**
     * Check if date is available
     */
    const available = await Appointment.findOne({
      where: {
        provider_id,
        canceled_at: null,
        date: hourStart,
      },
    });

    if (available) {
      return res.status(400).json({ error: 'Data não disponível' });
    }

    const appointment = await Appointment.create({
      user_id: req.userId,
      provider_id,
      date: hourStart,
    });

    /**
     * Send appointment notification for provider with mongodb
     */
    const user = await User.findByPk(req.userId);
    const dateFormated = format(hourStart, "dd 'de' MMMM', às' H:mm'h'", {
      locale: pt,
    });

    await Notification.create({
      content: `Novo agendamento de ${user.name} para o dia ${dateFormated}`,
      user: provider_id,
    });

    return res.json(appointment);
  }
}

export default new AppointmentController();
