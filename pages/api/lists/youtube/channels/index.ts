import bar from 'next-bar';
import { withPagination } from 'next-api-paginate';
import { withSentry } from '@sentry/nextjs';

import { ensureAuthenticated } from '@/middleware/auth';
import { ensureHasAccessToResource } from '@/middleware/permissions';

import * as youtubeChannelIDsController from '@/controllers/youtube-channel-ids/youtubeChannelIDsController';

export default bar({
  get: withSentry(
    ensureAuthenticated(
      ensureHasAccessToResource(
        withPagination({
          defaultLimit: Infinity,
          maxLimit: Infinity,
        })(youtubeChannelIDsController.index),
      ),
    ),
  ),
  post: withSentry(
    ensureAuthenticated(
      ensureHasAccessToResource(youtubeChannelIDsController.create),
    ),
  ),
});
