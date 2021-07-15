import NextAuth from 'next-auth';
import Providers from 'next-auth/providers';

import config from '@/config';
import db from '@/services/db';
import { AuthorizedUser } from '@/db/models/auth/AuthorizedUser';

export default function (req, res) {
  return NextAuth(req, res, {
    providers: [
      Providers.Discord({
        clientId: config.discord.clientId,
        clientSecret: config.discord.clientSecret,
        scope: 'identify guilds'
      })
    ],

    callbacks: {
      async signIn(user, account, profile) {
        await db.prepare();
        const authorizedUserRepository = db.getRepository(AuthorizedUser);

        if (!profile.id) {
          return false;
        }

        const authorizedUser = await authorizedUserRepository.findOne({
          discordId: (profile.id as string)
        });

        return !!authorizedUser;
      },

      async jwt(token, user, account, profile) {
        if (account?.accessToken) {
          token.accessToken = account.accessToken;
        }

        if (profile) {
          token.id = profile.id;
          token.discriminator = profile.discriminator;
        }

        return token;
      },

      async session(sess, token) {
        if (token?.accessToken) {
          sess.accessToken = token.accessToken as string;
        }

        if (token?.id) {
          sess.user.id = token.id as string;
        }

        if (token?.discriminator) {
          sess.user.discriminator = token.discriminator as string;
        }

        return sess;
      }
    }
  });
};
