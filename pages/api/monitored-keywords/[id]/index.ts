import bar from 'next-bar';
import { withSentry } from '@sentry/nextjs';

import { ensureAuthenticated } from '@/middleware/auth';

import * as monitoredKeywordsController from '@/controllers/monitored-keywords/monitoredKeywordsController';

export default bar({
  get: withSentry(ensureAuthenticated(monitoredKeywordsController.get, true)),
  patch: withSentry(ensureAuthenticated(monitoredKeywordsController.update, true)),
  delete: withSentry(ensureAuthenticated(monitoredKeywordsController.destroy, true))
});
