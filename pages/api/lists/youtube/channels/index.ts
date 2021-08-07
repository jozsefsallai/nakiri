import bar from 'next-bar';
import { ensureAuthenticated } from '@/middleware/auth';

import * as youtubeChannelIDsController from '@/controllers/youtube-channel-ids/youtubeChannelIDsController';
import { ensureHasAccessToGuild } from '@/middleware/permissions';

import { withPagination } from 'next-api-paginate';

export default bar({
  get: ensureAuthenticated(
    ensureHasAccessToGuild(
      withPagination({
        defaultLimit: Infinity,
        maxLimit: Infinity
      })(youtubeChannelIDsController.index)
    )
  ),
  post: ensureAuthenticated(
    ensureHasAccessToGuild(youtubeChannelIDsController.create)
  )
});
