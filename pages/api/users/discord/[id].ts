import bar from 'next-bar';

import * as usersController from '@/controllers/users/usersController';
import { ensureAuthenticated } from '@/middleware/auth';

export default bar({
  get: ensureAuthenticated(usersController.getData, true)
});
