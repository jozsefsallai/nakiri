import bar from 'next-bar';

import { ensureAuthenticated } from '@/middleware/auth';
import * as usersController from '@/controllers/users/usersController';

export default bar({
  get: ensureAuthenticated(usersController.get, true)
});
