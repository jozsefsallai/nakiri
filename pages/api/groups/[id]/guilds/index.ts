import bar from 'next-bar';
import { withSentry } from '@sentry/nextjs';

import { ensureAuthenticated } from '@/middleware/auth';

import * as groupsController from '@/controllers/groups/groupsController';

export default bar({
  post: withSentry(ensureAuthenticated(groupsController.addGuild, true)),
});
