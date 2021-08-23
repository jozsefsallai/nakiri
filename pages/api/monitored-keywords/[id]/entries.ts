import bar from 'next-bar';

import { ensureAuthenticated } from '@/middleware/auth';
import { withPagination } from 'next-api-paginate';

import * as keywordSearchResultsController from '@/controllers/keyword-search-results/keywordSearchResultsController';

export default bar({
  get: ensureAuthenticated(
    withPagination({
      defaultLimit: 25,
      maxLimit: 50
    })(keywordSearchResultsController.index), true),
});
