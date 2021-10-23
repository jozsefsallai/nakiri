import bar from 'next-bar';
import { withSentry } from '@sentry/nextjs';

import { ensureAuthenticated } from '@/middleware/auth';

import * as phrasesController from '@/controllers/phrases/phrasesController';

export default bar({
  delete: withSentry(ensureAuthenticated(phrasesController.destroy, true)),
});
