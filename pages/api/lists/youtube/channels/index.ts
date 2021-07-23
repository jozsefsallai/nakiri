import bar from 'next-bar';
import { ensureAuthenticated } from '@/middleware/auth';

import * as youtubeChannelIDsController from '@/controllers/youtube-channel-ids/youtubeChannelIDsController';
import { ensureHasAccessToGuild } from '@/middleware/permissions';

export default bar({
  get: ensureAuthenticated(
    ensureHasAccessToGuild(youtubeChannelIDsController.index)
  ),
  post: ensureAuthenticated(
    ensureHasAccessToGuild(youtubeChannelIDsController.create)
  )
});
