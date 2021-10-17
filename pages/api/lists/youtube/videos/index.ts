import bar from 'next-bar';
import { withPagination } from 'next-api-paginate';
import { withSentry } from '@sentry/nextjs';

import { ensureAuthenticated } from '@/middleware/auth';
import { ensureHasAccessToResource } from '@/middleware/permissions';

import * as youtubeVideoIDsController from '@/controllers/youtube-video-ids/youtubeVideoIDsController';

export default bar({
  get: withSentry(
    ensureAuthenticated(
      ensureHasAccessToResource(
        withPagination({
          defaultLimit: Infinity,
          maxLimit: Infinity,
        })(youtubeVideoIDsController.index),
      ),
    ),
  ),
  post: withSentry(
    ensureAuthenticated(
      ensureHasAccessToResource(youtubeVideoIDsController.create),
    ),
  ),
});
