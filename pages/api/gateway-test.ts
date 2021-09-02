import { NextApiHandler } from 'next';

import { queueGatewayMessage } from '@/jobs/queue';

const handler: NextApiHandler = async (req, res) => {
  await queueGatewayMessage(req.gateway, {
    message: 'Hello from Next.js!'
  });

  return res.json({ ok: true });
};

export default handler;
