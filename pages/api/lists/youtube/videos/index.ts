import bar from 'next-bar';
import { ensureAuthenticated } from '@/middleware/auth';

import * as youtubeVideoIDsController from '@/controllers/youtube-video-ids/youtubeVideoIDsController';

export default bar({
  get: ensureAuthenticated(youtubeVideoIDsController.index),
  post: ensureAuthenticated(youtubeVideoIDsController.create)
});
