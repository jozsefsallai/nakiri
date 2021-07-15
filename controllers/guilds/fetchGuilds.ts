import { Key } from '@/db/models/auth/Key';
import db from '@/services/db';
import axios from 'axios';
import { Session } from 'next-auth';

import { IGuild, IGuildWithKey } from './IGuild';

export const fetchGuilds = async (session: Session, all?: boolean): Promise<IGuild[] | IGuildWithKey[]> => {
  const discordResponse = await axios.get('https://discord.com/api/users/@me/guilds', {
    headers: {
      Authorization: `Bearer ${session.accessToken}`
    }
  }).then(res => res.data);

  const guilds = discordResponse
    .filter(guild => (guild.permissions & 0x2000) === 0x2000)
    .reverse();

  if (all) {
    return guilds;
  }

  await db.prepare();
  const keyRepository = db.getRepository(Key);

  const allGuilds = await keyRepository.find();

  const finalGuilds: IGuildWithKey[] = [];
  guilds.forEach(guild => {
    const keyEntry = allGuilds.find(entry => entry.guildId === guild.id);

    if (keyEntry) {
      finalGuilds.push({ ...guild, key: keyEntry.key });
    }
  });

  return finalGuilds;
};
