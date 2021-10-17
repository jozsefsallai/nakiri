import bar from 'next-bar';
import { withSentry } from '@sentry/nextjs';

import { ensureAuthenticated } from '@/middleware/auth';
import { ensureHasAccessToResource } from '@/middleware/permissions';

import * as analyzerController from '@/controllers/analyzer/analyzerController';

export default bar({
  post: withSentry(
    ensureAuthenticated(ensureHasAccessToResource(analyzerController.analyze)),
  ),
});
