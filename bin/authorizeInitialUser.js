require('ts-node/register');
require('dotenv').config();

const config = require('../config').default;
const db = require('../services/db').default;

const axios = require('axios');

const { AuthorizedUser } = require('../db/models/auth/AuthorizedUser');

(async () => {
  await db.prepare();
  const authorizedUserRepository = db.getRepository(AuthorizedUser);

  const discordId = process.env.INITIAL_USER_DISCORD_ID;
  const count = await authorizedUserRepository.count({ discordId });

  if (count > 0) {
    console.log('Initial user already authorized. Skipping.');
    return;
  }

  const discordResponse = await axios
    .get(`https://discordapp.com/api/users/${discordId}`, {
      headers: {
        Authorization: `Bot ${config.discord.botToken}`,
      },
    })
    .then((res) => res.data);

  const user = new AuthorizedUser();
  user.discordId = discordId;
  user.name = discordResponse.username;
  user.discriminator = discordResponse.discriminator;
  user.image = discordResponse.avatar;
  user.permissions = 15;

  await authorizedUserRepository.insert(user);
  console.log('Initial user authorized successfully.');
})()
  .then(() => process.exit(0))
  .catch(console.error);
