import bar from 'next-bar';
import { withSentry } from '@sentry/nextjs';

import { ensureAuthenticated } from '@/middleware/auth';

import * as youtubeChannelIDsController from '@/controllers/youtube-channel-ids/youtubeChannelIDsController';

export default bar({
  delete: withSentry(ensureAuthenticated(youtubeChannelIDsController.destroy, true))
});
