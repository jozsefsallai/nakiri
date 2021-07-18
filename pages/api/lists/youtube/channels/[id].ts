import bar from 'next-bar';
import { ensureAuthenticated } from '@/middleware/auth';

import * as youtubeChannelIDsController from '@/controllers/youtube-channel-ids/youtubeChannelIDsController';

export default bar({
  delete: ensureAuthenticated(youtubeChannelIDsController.destroy, true)
});
