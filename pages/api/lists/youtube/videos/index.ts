import bar from 'next-bar';
import { ensureAuthenticated } from '@/middleware/auth';

import * as youtubeVideoIDsController from '@/controllers/youtube-video-ids/youtubeVideoIDsController';
import { ensureHasAccessToGuild } from '@/middleware/permissions';

import { withPagination } from 'next-api-paginate';

export default bar({
  get: ensureAuthenticated(
    ensureHasAccessToGuild(
      withPagination({
        defaultLimit: Infinity,
        maxLimit: Infinity
      })(youtubeVideoIDsController.index)
    )
  ),
  post: ensureAuthenticated(
    ensureHasAccessToGuild(youtubeVideoIDsController.create)
  )
});
