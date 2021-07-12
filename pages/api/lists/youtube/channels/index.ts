import bar from 'next-bar';
import { ensureAuthenticated } from '@/middleware/auth';

import * as youtubeChannelIDsController from '@/controllers/youtube-channel-ids/youtubeChannelIDsController';

export default bar({
  get: ensureAuthenticated(youtubeChannelIDsController.index),
  post: ensureAuthenticated(youtubeChannelIDsController.create)
});
