require('ts-node/register');
require('dotenv').config();

const db = require('../services/db').default;
const { AuthorizedUser } = require('../db/models/auth/AuthorizedUser');
const config = require('../config').default;

const axios = require('axios');

(async () => {
  await db.prepare();
  const authorizedUserRepository = db.getRepository(AuthorizedUser);

  const users = await authorizedUserRepository.find();

  for await (const user of users) {
    const { data } = await axios.get(`https://discordapp.com/api/users/${user.discordId}`, {
      headers: {
        Authorization: `Bot ${config.discord.botToken}`,
      }
    });

    const { username, discriminator, avatar } = data;
    await authorizedUserRepository.update(user.id, {
      name: username,
      discriminator,
      image: avatar
    });

    console.log(`Updated user ${username}#${discriminator} (ID: ${user.discordId})`);
  }
})().then(() => {
  console.log('Done!');
  process.exit(0);
}).catch(console.error);
