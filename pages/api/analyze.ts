import bar from 'next-bar';
import { ensureAuthenticated } from '@/middleware/auth';

import * as analyzerController from '@/controllers/analyzer/analyzerController';

export default bar({
  post: ensureAuthenticated(analyzerController.analyze)
});
