import bar from 'next-bar';
import { withPagination } from 'next-api-paginate';
import { withSentry } from '@sentry/nextjs';

import { ensureAuthenticated } from '@/middleware/auth';
import { ensureHasAccessToResource } from '@/middleware/permissions';

import * as phrasesController from '@/controllers/phrases/phrasesController';

export default bar({
  get: withSentry(
    ensureAuthenticated(
      ensureHasAccessToResource(
        withPagination({
          defaultLimit: Infinity,
          maxLimit: Infinity,
        })(phrasesController.index),
      ),
    ),
  ),
  post: withSentry(
    ensureAuthenticated(ensureHasAccessToResource(phrasesController.create)),
  ),
});
