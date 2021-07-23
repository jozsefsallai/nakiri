import bar from 'next-bar';
import { ensureAuthenticated } from '@/middleware/auth';

import * as analyzerController from '@/controllers/analyzer/analyzerController';
import { ensureHasAccessToGuild } from '@/middleware/permissions';

export default bar({
  post: ensureAuthenticated(
    ensureHasAccessToGuild(analyzerController.analyze)
  )
});
