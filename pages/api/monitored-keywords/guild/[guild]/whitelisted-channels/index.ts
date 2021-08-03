import bar from 'next-bar';
import { ensureAuthenticated } from '@/middleware/auth';

import * as keywordWhitelistedChannelsController from '@/controllers/keyword-whitelisted-channels/keywordWhitelistedChannelsController';

export default bar({
  get: ensureAuthenticated(keywordWhitelistedChannelsController.index, true),
  post: ensureAuthenticated(keywordWhitelistedChannelsController.create, true),
});
