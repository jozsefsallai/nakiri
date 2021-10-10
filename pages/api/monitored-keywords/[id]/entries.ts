import bar from 'next-bar';
import { withPagination } from 'next-api-paginate';
import { withSentry } from '@sentry/nextjs';

import { ensureAuthenticated } from '@/middleware/auth';

import * as keywordSearchResultsController from '@/controllers/keyword-search-results/keywordSearchResultsController';

export default bar({
  get: withSentry(
    ensureAuthenticated(
      withPagination({
        defaultLimit: 25,
        maxLimit: 50,
      })(keywordSearchResultsController.index),
      true,
    ),
  ),
});
