import bar from 'next-bar';
import { ensureAuthenticated } from '@/middleware/auth';

import * as keywordWhitelistedChannelsController from '@/controllers/keyword-whitelisted-channels/keywordWhitelistedChannelsController';

export default bar({
  delete: ensureAuthenticated(keywordWhitelistedChannelsController.destroy, true),
});
