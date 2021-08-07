import bar from 'next-bar';
import { ensureAuthenticated } from '@/middleware/auth';

import * as linkPatternsController from '@/controllers/link-patterns/linkPatternsController';
import { ensureHasAccessToGuild } from '@/middleware/permissions';

import { withPagination } from 'next-api-paginate';

export default bar({
  get: ensureAuthenticated(
    ensureHasAccessToGuild(
      withPagination({
        defaultLimit: Infinity,
        maxLimit: Infinity
      })(linkPatternsController.index)
    )
  ),
  post: ensureAuthenticated(
    ensureHasAccessToGuild(linkPatternsController.create)
  )
});
