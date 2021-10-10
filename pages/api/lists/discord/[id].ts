import bar from 'next-bar';
import { withSentry } from '@sentry/nextjs';

import { ensureAuthenticated } from '@/middleware/auth';

import * as discordGuildsController from '@/controllers/discord-guilds/discordGuildsController';

export default bar({
  delete: withSentry(
    ensureAuthenticated(discordGuildsController.destroy, true),
  ),
});
