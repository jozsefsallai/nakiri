import bar from 'next-bar';
import { withSentry } from '@sentry/nextjs';

import { ensureAuthenticated } from '@/middleware/auth';
import * as usersController from '@/controllers/users/usersController';

export default bar({
  get: withSentry(ensureAuthenticated(usersController.get, true))
});
