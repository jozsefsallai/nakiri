import bar from 'next-bar';
import { withPagination } from 'next-api-paginate';
import { withSentry } from '@sentry/nextjs';

import { ensureAuthenticated } from '@/middleware/auth';
import { ensureHasAccessToResource } from '@/middleware/permissions';

import * as discordGuildsController from '@/controllers/discord-guilds/discordGuildsController';

export default bar({
  get: withSentry(
    ensureAuthenticated(
      ensureHasAccessToResource(
        withPagination({
          defaultLimit: Infinity,
          maxLimit: Infinity,
        })(discordGuildsController.index),
      ),
    ),
  ),
  post: withSentry(
    ensureAuthenticated(
      ensureHasAccessToResource(discordGuildsController.create),
    ),
  ),
});
