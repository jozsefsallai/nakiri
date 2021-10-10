import bar from 'next-bar';
import { withSentry } from '@sentry/nextjs';

import { ensureAuthenticated } from '@/middleware/auth';

import * as linkPatternsController from '@/controllers/link-patterns/linkPatternsController';

export default bar({
  delete: withSentry(ensureAuthenticated(linkPatternsController.destroy, true)),
});
