import bar from 'next-bar';
import { withSentry } from '@sentry/nextjs';

import * as usersController from '@/controllers/users/usersController';
import { ensureAuthenticated } from '@/middleware/auth';

export default bar({
  get: withSentry(ensureAuthenticated(usersController.index, true))
});
