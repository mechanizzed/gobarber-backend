import User from '../../models/User/User';

class UserController {
  async store(req, res) {
    const checkUser = await User.findOne({ where: { email: req.body.email } });
    if (checkUser) {
      return res.status(400).json({ error: 'E-mail já cadastrado' });
    }
    const { id, name, email, provider } = await User.create(req.body);
    return res.json({ id, name, email, provider });
  }

  async update(req, res) {
    console.log(req.userId);
    return res.json({ ok: true });
  }
}

export default new UserController();