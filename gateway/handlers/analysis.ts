import { GatewayContext } from '../client';
import { AnalysisRequest } from '../typings/requests';

import { queueAnalysisMessage } from '@/jobs/queue';

const handler = async (ctx: GatewayContext<AnalysisRequest>) => {
  const { client, gateway, content, options } = ctx;

  queueAnalysisMessage(gateway, {
    groupId: client.getGroup().id,
    clientSessionId: client.getSessionId(),
    content,
    options,
  });
};

export default handler;
