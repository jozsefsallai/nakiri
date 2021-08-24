import bar from 'next-bar';
import { withSentry } from '@sentry/nextjs';

import { ensureAuthenticated } from '@/middleware/auth';

import * as youtubeVideoIDsController from '@/controllers/youtube-video-ids/youtubeVideoIDsController';

export default bar({
  delete: withSentry(ensureAuthenticated(youtubeVideoIDsController.destroy, true))
});
