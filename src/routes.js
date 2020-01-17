import { Router } from 'express';

const routes = new Router();

routes.get('/', (req, res) => {
  return res.json({ messgae: 'Hello word' });
});

export default routes;
