import { NextApiHandler } from 'next';

const handler: NextApiHandler = (req, res) => {
  req.gateway.send('Hello from Next.js!');
  return res.json({ ok: true });
};

export default handler;
