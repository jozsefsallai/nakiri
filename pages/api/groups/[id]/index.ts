import bar from 'next-bar';
import { withSentry } from '@sentry/nextjs';

import { ensureAuthenticated } from '@/middleware/auth';

import * as groupsController from '@/controllers/groups/groupsController';

export default bar({
  get: withSentry(ensureAuthenticated(groupsController.get, true)),
  put: withSentry(ensureAuthenticated(groupsController.update, true)),
  delete: withSentry(ensureAuthenticated(groupsController.destroy, true)),
});
