import bar from 'next-bar';
import { withSentry } from '@sentry/nextjs';

import { ensureAuthenticated } from '@/middleware/auth';

import * as keywordWhitelistedChannelsController from '@/controllers/keyword-whitelisted-channels/keywordWhitelistedChannelsController';

export default bar({
  delete: withSentry(
    ensureAuthenticated(keywordWhitelistedChannelsController.destroy, true),
  ),
});
