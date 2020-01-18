import Notification from '../../schemas/Notification';
import User from '../../models/User/User';

class NotificationController {
  async index(req, res) {
    // check if provider_id is a provider
    const idProvider = await User.findOne({
      where: { id: req.userId, provider: true },
    });
    if (!idProvider) {
      return res.status(401).json({
        error: 'Apenas provedores podem receber notificações',
      });
    }

    const notifications = await Notification.find({
      user: req.userId,
    })
      .sort({ createdAt: 'desc' })
      .limit(20);

    return res.json(notifications);
  }

  async update(req, res) {
    // const notification = await Notification.findById(req.params.id);
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      {
        read: true,
      },
      { new: true }
    );
    return res.json(notification);
  }
}

export default new NotificationController();
