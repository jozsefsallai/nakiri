import bar from 'next-bar';
import { ensureAuthenticated } from '@/middleware/auth';

import * as youtubeVideoIDsController from '@/controllers/youtube-video-ids/youtubeVideoIDsController';
import { ensureHasAccessToGuild } from '@/middleware/permissions';

export default bar({
  get: ensureAuthenticated(
    ensureHasAccessToGuild(youtubeVideoIDsController.index)
  ),
  post: ensureAuthenticated(
    ensureHasAccessToGuild(youtubeVideoIDsController.create)
  )
});
