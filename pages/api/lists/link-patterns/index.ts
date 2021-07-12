import bar from 'next-bar';
import { ensureAuthenticated } from '@/middleware/auth';

import * as linkPatternsController from '@/controllers/link-patterns/linkPatternsController';

export default bar({
  get: ensureAuthenticated(linkPatternsController.index),
  post: ensureAuthenticated(linkPatternsController.create)
});
