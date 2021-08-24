import bar from 'next-bar';
import { withSentry } from '@sentry/nextjs';

import * as usersController from '@/controllers/users/usersController';

import { ensureAuthenticated } from '@/middleware/auth';
import { ensureUserHasPermissions } from '@/middleware/permissions';

import { UserPermissions } from '@/lib/UserPermissions';

export default bar({
  patch: withSentry(
    ensureAuthenticated(
      ensureUserHasPermissions(
        usersController.updatePermissions,
        [ UserPermissions.MANAGE_AUTHORIZED_USERS ]
      ), true
    )
  ),

  delete: withSentry(
    ensureAuthenticated(
      ensureUserHasPermissions(
        usersController.destroy,
        [ UserPermissions.MANAGE_AUTHORIZED_USERS ]
      ), true
    )
  )
});
