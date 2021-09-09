import bar from 'next-bar';
import { withSentry } from '@sentry/nextjs';

import { ensureAuthenticated } from '@/middleware/auth';

import * as keywordWhitelistedChannelsController from '@/controllers/keyword-base-invertlisted-channels/keywordWhitelistedChannelsController';

export default bar({
  get: withSentry(ensureAuthenticated(keywordWhitelistedChannelsController.index, true)),
  post: withSentry(ensureAuthenticated(keywordWhitelistedChannelsController.create, true)),
});
