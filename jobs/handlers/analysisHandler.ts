import { ProcessCallbackFunction } from 'bull';

import { IAnalyzerOptions } from '@/core/analyzer/IAnalyzerOptions';
import { Analyzer } from '@/core/analyzer';
import { handleError } from '@/lib/errors';

import { AnalysisRequest } from '@/gateway/typings/requests';

export interface IAnalysisRequest extends AnalysisRequest {
  groupId: string;
  clientSessionId: string;
}

const handler: ProcessCallbackFunction<IAnalysisRequest> = async (
  job,
  done,
) => {
  const { groupId, clientSessionId, content, options, messageContext } =
    job.data;

  if (process.env.NODE_ENV !== 'production') {
    console.log(`[${job.queue.name}] <- received analysis request for`, {
      content,
      clientSessionId,
      groupId,
    });
  }

  const analyzer = new Analyzer(groupId, content, options, global.__gateway);

  try {
    await analyzer.analyzeForGatewayClient(clientSessionId, messageContext);

    return done();
  } catch (err) {
    handleError(err);

    return done();
  }
};

export default handler;
