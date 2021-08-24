import bar from 'next-bar';
import { withSentry } from '@sentry/nextjs';

import * as guildsController from '@/controllers/guilds/guildsController';
import { ensureAuthenticated } from '@/middleware/auth';

export default bar({
  get: withSentry(ensureAuthenticated(guildsController.all, true))
});
