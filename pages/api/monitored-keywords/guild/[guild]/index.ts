import bar from 'next-bar';
import { ensureAuthenticated } from '@/middleware/auth';

import * as monitoredKeywordsContoller from '@/controllers/monitored-keywords/monitoredKeywordsController';

export default bar({
  get: ensureAuthenticated(monitoredKeywordsContoller.index, true)
});
