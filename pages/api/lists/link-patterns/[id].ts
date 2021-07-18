import bar from 'next-bar';
import { ensureAuthenticated } from '@/middleware/auth';

import * as linkPatternsController from '@/controllers/link-patterns/linkPatternsController';

export default bar({
  delete: ensureAuthenticated(linkPatternsController.destroy, true)
});
