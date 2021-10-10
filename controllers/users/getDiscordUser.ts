import axios from 'axios';
import config from '@/config';

export const getDiscordUser = async (discordId: string) => {
  const { data } = await axios.get(
    `https://discordapp.com/api/users/${discordId}`,
    {
      headers: {
        Authorization: `Bot ${config.discord.botToken}`,
      },
    },
  );

  return data;
};
