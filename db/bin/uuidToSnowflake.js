require('ts-node/register');
require('dotenv').config();

const { AuthorizedGuild } = require('../models/auth/AuthorizedGuild');
const { AuthorizedUser } = require('../models/auth/AuthorizedUser');
const { Group } = require('../models/groups/Group');
const { GroupMember } = require('../models/groups/GroupMember');
const { YouTubeVideoID } = require('../models/blacklists/YouTubeVideoID');
const { YouTubeChannelID } = require('../models/blacklists/YouTubeChannelID');
const { LinkPattern } = require('../models/blacklists/LinkPattern');
const { DiscordGuild } = require('../models/blacklists/DiscordGuild');
const { Phrase } = require('../models/blacklists/Phrase');
const {
  KeywordSearchResult,
} = require('../models/keywords/KeywordSearchResult');
const {
  KeywordWhitelistedChannel,
} = require('../models/keywords/KeywordWhitelistedChannel');
const { MonitoredKeyword } = require('../models/keywords/MonitoredKeyword');

const db = require('../../services/db').default;
const { snowflake } = require('../../lib/snowflake');

const models = [
  AuthorizedGuild,
  AuthorizedUser,
  Group,
  GroupMember,
  YouTubeVideoID,
  YouTubeChannelID,
  LinkPattern,
  DiscordGuild,
  Phrase,
  KeywordSearchResult,
  MonitoredKeyword,
  KeywordWhitelistedChannel,
];

const run = async () => {
  await db.prepare();

  for await (const model of models) {
    const repository = db.getRepository(model);

    const entries = await repository.find();

    process.stdout.write(
      `Updating table ${repository.metadata.tableName} (${entries.length} rows): `,
    );

    for await (const entry of entries) {
      const id = entry.createdAt
        ? snowflake(entry.createdAt.getTime())
        : snowflake();

      await repository.query(
        `UPDATE \`${repository.metadata.tableName}\` SET \`id\` = '${id}' WHERE \`id\` = '${entry.id}'`,
      );
      process.stdout.write('.');
    }

    process.stdout.write('\n');
  }
};

run()
  .then(() => {
    console.log('Done!');
    process.exit();
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
