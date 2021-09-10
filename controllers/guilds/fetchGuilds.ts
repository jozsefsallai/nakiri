import { AuthorizedGuild } from '@/db/models/auth/AuthorizedGuild';
import db from '@/services/db';
import Redis from '@/services/redis';
import axios from 'axios';
import { Session } from 'next-auth';

import { IGuild, IGuildWithKey } from './IGuild';

export const fetchGuilds = async (session: Session, all?: boolean, cached: boolean = true): Promise<IGuild[] | IGuildWithKey[]> => {
  const redis = Redis.getInstance();
  const key = `guilds:${session.user.id}`;

  let guilds = await redis.get<IGuild[]>(key);

  if (!cached || !guilds || typeof guilds === 'string') {
    const discordResponse: IGuild[] = await axios.get('https://discord.com/api/users/@me/guilds', {
      headers: {
        Authorization: `Bearer ${session.accessToken}`
      }
    }).then(res => res.data);

    guilds = discordResponse
      .filter(guild => (guild.permissions & 0x2000) === 0x2000)
      .reverse();

    await redis.set<IGuild[]>(key, guilds, 5 * 60);
  }

  if (all) {
    return guilds;
  }

  await db.prepare();
  const guildRepository = db.getRepository(AuthorizedGuild);

  const allGuilds = await guildRepository.find();

  const finalGuilds: IGuildWithKey[] = [];
  guilds.forEach(guild => {
    const keyEntry = allGuilds.find(entry => entry.guildId === guild.id);

    if (keyEntry) {
      finalGuilds.push({ ...guild, key: keyEntry.key });
    }
  });

  return finalGuilds;
};
