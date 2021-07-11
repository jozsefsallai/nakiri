import config from '../config';

import { ConnectionOptions, createConnection, getConnection, getManager, getRepository } from 'typeorm';

import { YouTubeVideoID } from '../db/models/blacklists/YouTubeVideoID';
import { YouTubeChannelID } from '../db/models/blacklists/YouTubeChannelID';
import { LinkPattern } from '../db/models/blacklists/LinkPattern';

import { AuthorizedUser } from '../db/models/auth/AuthorizedUser';
import { Key } from '../db/models/auth/Key';

import { CamelCaseNamingStrategy } from '../lib/namingStrategies';

const connectionOptions: ConnectionOptions = {
  type: config.database.dialect as any,
  host: config.database.host,
  port: config.database.port,
  username: config.database.username,
  password: config.database.password,
  database: config.database.name,

  extra: {
    charset: 'utf8mb4_unicode_ci'
  },

  namingStrategy: new CamelCaseNamingStrategy(),

  entities: [
    YouTubeVideoID,
    YouTubeChannelID,
    LinkPattern,

    AuthorizedUser,
    Key
  ]
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

  getConnection,
  getManager,
  getRepository
};

export default db;

export {
  connectionOptions
};
