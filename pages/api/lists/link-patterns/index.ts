import bar from 'next-bar';
import { withPagination } from 'next-api-paginate';
import { withSentry } from '@sentry/nextjs';

import { ensureAuthenticated } from '@/middleware/auth';
import { ensureHasAccessToResource } from '@/middleware/permissions';

import * as linkPatternsController from '@/controllers/link-patterns/linkPatternsController';

export default bar({
  get: withSentry(
    ensureAuthenticated(
      ensureHasAccessToResource(
        withPagination({
          defaultLimit: Infinity,
          maxLimit: Infinity,
        })(linkPatternsController.index),
      ),
    ),
  ),
  post: withSentry(
    ensureAuthenticated(
      ensureHasAccessToResource(linkPatternsController.create),
    ),
  ),
});
