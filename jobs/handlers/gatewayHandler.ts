import { ProcessCallbackFunction } from 'bull';

import { v4 as uuid } from 'uuid';

export interface IGatewayRequest {
  message: string;
}

const handler: ProcessCallbackFunction<IGatewayRequest> = async (job) => {
  return {
    key: uuid(),
    type: 'test',
    message: job.data.message,
  };
};

export default handler;
