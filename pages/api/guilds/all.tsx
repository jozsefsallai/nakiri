import bar from 'next-bar';

import * as guildsController from '@/controllers/guilds/guildsController';
import { ensureAuthenticated } from '@/middleware/auth';

export default bar({
  get: ensureAuthenticated(guildsController.all, true)
});
