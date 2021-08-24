import { NextApiHandler } from 'next';
import { getSession } from 'next-auth/client';

import { getPagination, hasNextPages, hasPreviousPages } from 'next-api-paginate';

import { getKeywordSearchResults } from './getKeywordSearchResults';

import firstOf from '@/lib/firstOf';

import { captureException } from '@sentry/nextjs';

export const index: NextApiHandler = async (req, res) => {
  const id = firstOf(req.query.id);
  const session = await getSession({ req });

  const { page, limit } = getPagination(req);

  const skip = limit !== Infinity ? (page - 1) * limit : undefined;
  const take = limit !== Infinity ? limit : undefined;

  try {
    const { keywordSearchResults, totalCount } = await getKeywordSearchResults(session, id, skip, take);

    const pageCount = limit !== Infinity ? Math.ceil(totalCount / limit) : 1;

    const pagination = {
      page,
      limit,
      pageCount,
      totalCount,
      hasPrevious: hasPreviousPages(req),
      hasNext: hasNextPages(req)(pageCount)
    };

    return res.json({
      ok: true,
      pagination,
      keywordSearchResults
    });
  } catch (err) {
    if (err.name === 'GetKeywordSearchResultsError') {
      return res.status(err.statusCode).json({
        ok: false,
        error: err.code
      });
    }

    captureException(err);

    return res.status(500).json({
      ok: false,
      error: 'INTERNAL_SERVER_ERROR'
    });
  }
};
