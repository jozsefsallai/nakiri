import bar from 'next-bar';
import { ensureAuthenticated } from '@/middleware/auth';

import * as monitoredKeywordsContoller from '@/controllers/monitored-keywords/monitoredKeywordsController';

export default bar({
  post: ensureAuthenticated(monitoredKeywordsContoller.create, true)
});
