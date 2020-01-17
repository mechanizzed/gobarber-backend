import * as Yup from 'yup';
import User from '../../models/User/User';
import Appointment from '../../models/Appointment/Appointment';

class AppointmentController {
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

    const appointment = await Appointment.create({
      user_id: req.userId,
      provider_id,
      date,
    });

    return res.json(appointment);
  }
}

export default new AppointmentController();
