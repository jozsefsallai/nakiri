import bar from 'next-bar';
import { ensureAuthenticated } from '@/middleware/auth';

import * as monitoredKeywordsController from '@/controllers/monitored-keywords/monitoredKeywordsController';

export default bar({
  put: ensureAuthenticated(monitoredKeywordsController.update, true),
  delete: ensureAuthenticated(monitoredKeywordsController.destroy, true)
});
