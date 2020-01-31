import User from '../../models/User/User';
import File from '../../models/File/File';

class UserController {
  /**
   * Store user
   */
  async store(req, res) {
    const checkUser = await User.findOne({ where: { email: req.body.email } });
    if (checkUser) {
      return res.status(400).json({ error: 'E-mail já cadastrado' });
    }
    const { id, name, email, provider } = await User.create(req.body);
    return res.json({ id, name, email, provider });
  }

  /**
   * Update user
   */
  async update(req, res) {
    const user = await User.findByPk(req.userId);
    const { name, oldPassword } = req.body;

    if (oldPassword && !(await user.checkPassword(oldPassword))) {
      return res.status(401).json({ error: 'Senha atual inválida' });
    }
    await user.update(req.body);

    const { id, email, avatar } = await User.findByPk(req.userId, {
      include: [
        {
          model: File,
          as: 'avatar',
          attributes: ['id', 'path', 'url'],
        },
      ],
    });

    return res.json({ id, name, email, avatar });
  }
}

export default new UserController();
