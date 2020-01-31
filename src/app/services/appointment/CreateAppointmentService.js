import { startOfHour, parseISO, isBefore, format } from 'date-fns';
import pt from 'date-fns/locale/pt';

// Models
import User from '../../models/User/User';
import Appointment from '../../models/Appointment/Appointment';

// NotificationSchema Mongo
import Notification from '../../schemas/Notification';

class CreateAppointmentService {
  async run({ provider_id, user_id, date }) {
    // check if provider_id is a provider
    const idProvider = await User.findOne({
      where: { id: provider_id, provider: true },
    });
    if (!idProvider) {
      throw new Error(
        'Você só pode criar agendamentos com um provedor de serviços'
      );
    }

    /**
     * Check past date
     */
    const hourStart = startOfHour(parseISO(date));
    if (isBefore(hourStart, new Date())) {
      throw new Error('Data inválida');
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
      throw new Error('Data não disponível');
    }

    const appointment = await Appointment.create({
      user_id,
      provider_id,
      date: hourStart,
    });

    /**
     * Send appointment notification for provider with mongodb
     */
    const user = await User.findByPk(user_id);
    const dateFormated = format(hourStart, "dd 'de' MMMM', às' H:mm'h'", {
      locale: pt,
    });

    await Notification.create({
      content: `Novo agendamento de ${user.name} para o dia ${dateFormated}`,
      user: provider_id,
    });

    return appointment;
  }
}

export default new CreateAppointmentService();
