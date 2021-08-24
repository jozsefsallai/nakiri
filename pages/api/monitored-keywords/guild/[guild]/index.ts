import bar from 'next-bar';
import { withSentry } from '@sentry/nextjs';

import { ensureAuthenticated } from '@/middleware/auth';

import * as monitoredKeywordsContoller from '@/controllers/monitored-keywords/monitoredKeywordsController';

export default bar({
  get: withSentry(ensureAuthenticated(monitoredKeywordsContoller.index, true))
});
