import bar from 'next-bar';
import { withPagination } from 'next-api-paginate';
import { withSentry } from '@sentry/nextjs';

import { ensureAuthenticated } from '@/middleware/auth';
import { ensureHasAccessToGuild } from '@/middleware/permissions';

import * as youtubeVideoIDsController from '@/controllers/youtube-video-ids/youtubeVideoIDsController';

export default bar({
  get: withSentry(
    ensureAuthenticated(
      ensureHasAccessToGuild(
        withPagination({
          defaultLimit: Infinity,
          maxLimit: Infinity,
        })(youtubeVideoIDsController.index),
      ),
    ),
  ),
  post: withSentry(
    ensureAuthenticated(
      ensureHasAccessToGuild(youtubeVideoIDsController.create),
    ),
  ),
});
