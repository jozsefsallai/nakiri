import config from '../config';

import {
  Connection,
  ConnectionOptions,
  createConnection,
  getConnection,
  getManager,
  getRepository,
} from 'typeorm';

import { YouTubeVideoID } from '../db/models/blacklists/YouTubeVideoID';
import { YouTubeChannelID } from '../db/models/blacklists/YouTubeChannelID';
import { LinkPattern } from '../db/models/blacklists/LinkPattern';
import { DiscordGuild } from '../db/models/blacklists/DiscordGuild';
import { Phrase } from '../db/models/blacklists/Phrase';

import { AuthorizedUser } from '../db/models/auth/AuthorizedUser';
import { AuthorizedGuild } from '../db/models/auth/AuthorizedGuild';
import { Group } from '../db/models/groups/Group';
import { GroupMember } from '../db/models/groups/GroupMember';

import { MonitoredKeyword } from '../db/models/keywords/MonitoredKeyword';
import { KeywordSearchResult } from '../db/models/keywords/KeywordSearchResult';
import { KeywordWhitelistedChannel } from '../db/models/keywords/KeywordWhitelistedChannel';

import { CamelCaseNamingStrategy } from '../lib/namingStrategies';

const connectionOptions: ConnectionOptions = {
  type: config.database.dialect as any,
  host: config.database.host,
  port: config.database.port,
  username: config.database.username,
  password: config.database.password,
  database: config.database.name,

  extra: {
    charset: 'utf8mb4_unicode_ci',
  },

  namingStrategy: new CamelCaseNamingStrategy(),

  entities: [
    YouTubeVideoID,
    YouTubeChannelID,
    LinkPattern,
    DiscordGuild,
    Phrase,

    AuthorizedUser,
    AuthorizedGuild,
    Group,
    GroupMember,

    MonitoredKeyword,
    KeywordSearchResult,
    KeywordWhitelistedChannel,
  ],
};

let connectionReadyPromise: Promise<void> | null = null;

const db = {
  prepare() {
    if (!connectionReadyPromise) {
      connectionReadyPromise = (async () => {
        try {
          const connection = getConnection();
          await connection.close();
        } catch (err) {}

        await createConnection(connectionOptions);
      })();
    }

    return connectionReadyPromise;
  },

  async getTemporaryNamedConnection(name: string): Promise<Connection> {
    try {
      const connection = getConnection(name);
      await connection.close();
    } catch (err) {}

    return createConnection({ name, ...connectionOptions });
  },

  getConnection,
  getManager,
  getRepository,
};

export default db;

export { connectionOptions };
