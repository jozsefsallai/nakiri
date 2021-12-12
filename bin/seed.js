require('ts-node/register');
require('tsconfig-paths/register');
require('dotenv').config();

const factory = require('../db/factory').default;
const db = require('../services/db').default;
const { AuthorizedUser } = require('../db/models/auth/AuthorizedUser');

const {
  collectVideoMetadata,
  collectChannelMetadata,
} = require('../jobs/queue');

const fixtures = require('../db/factory/fixtures').default;

const queueWait = (queue, data) => {
  return new Promise((resolve, reject) => {
    queue.on('completed', resolve);
    queue.on('failed', reject);
    queue.add(data);
  });
};

(async () => {
  await db.prepare();
  const userRepository = db.getRepository(AuthorizedUser);

  const user = await userRepository.findOne();
  if (!user) {
    console.log('No initial user. Please run `node bin/authorizeUser` first.');
    process.exit(1);
  }

  await factory.create('authorizedGuild');
  console.log('Created authorized guild.');

  for await (const fixture of fixtures.youtubeVideoIDs) {
    const entry = await factory.create('youtubeVideoID', {
      videoId: fixture,
    });

    await queueWait(collectVideoMetadata, { entry });
  }

  console.log('Created YouTube video IDs.');

  for await (const fixture of fixtures.youtubeChannelIDs) {
    const entry = await factory.create('youtubeChannelID', {
      channelId: fixture,
    });

    await queueWait(collectChannelMetadata, { entry });
  }

  console.log('Created YouTube channel IDs.');

  for await (const fixture of fixtures.linkPatterns) {
    await factory.create('linkPattern', {
      pattern: fixture,
    });
  }

  console.log('Created link patterns.');

  await factory.createMany('discordGuild', 10);
  console.log('Created Discord guilds.');

  await factory.createMany('phrase', 10);
  console.log('Created phrases.');

  const groups = await factory.createMany('group', 3, {
    creator: user,
  });
  console.log('Created groups.');

  for await (const group of groups) {
    await factory.create('groupMember', {
      group,
      user,
    });
  }
  console.log('Created group members.');
})()
  .then(() => {
    console.log('Done!');
    process.exit();
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
