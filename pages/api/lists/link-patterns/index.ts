import bar from 'next-bar';
import { withPagination } from 'next-api-paginate';
import { withSentry } from '@sentry/nextjs';

import { ensureAuthenticated } from '@/middleware/auth';
import { ensureHasAccessToGuild } from '@/middleware/permissions';

import * as linkPatternsController from '@/controllers/link-patterns/linkPatternsController';

export default bar({
  get: withSentry(
    ensureAuthenticated(
      ensureHasAccessToGuild(
        withPagination({
          defaultLimit: Infinity,
          maxLimit: Infinity,
        })(linkPatternsController.index),
      ),
    ),
  ),
  post: withSentry(
    ensureAuthenticated(ensureHasAccessToGuild(linkPatternsController.create)),
  ),
});
