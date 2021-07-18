import bar from 'next-bar';
import { ensureAuthenticated } from '@/middleware/auth';

import * as youtubeVideoIDsController from '@/controllers/youtube-video-ids/youtubeVideoIDsController';

export default bar({
  delete: ensureAuthenticated(youtubeVideoIDsController.destroy, true)
});
