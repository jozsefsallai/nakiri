import { IConfig } from './IConfig';

const config: IConfig = {
  app: {
    protocol: process.env.PROTOCOL,
    domain: process.env.DOMAIN,
    port: process.env.PORT && parseInt(process.env.PORT, 10),
    sessionSecret: process.env.SESSION_SECRET,
    cookieSecret: process.env.COOKIE_SECRET,
  },

  database: {
    dialect: process.env.DATABASE_DIALECT,
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT && parseInt(process.env.DATABASE_PORT, 10),
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    name: process.env.DATABASE_NAME,
  },

  redis: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT && parseInt(process.env.REDIS_PORT, 10),
    password: process.env.REDIS_PASSWORD || undefined,

    buildRedisUrl(database?: number): string {
      const password = config.redis.password
        ? `:${config.redis.password}@`
        : '';

      const redisUrl = `redis://${password}${config.redis.host}:${config.redis.port}`;
      return database ? `${redisUrl}/${database}` : redisUrl;
    },
  },

  discord: {
    clientId: process.env.DISCORD_CLIENT_ID,
    clientSecret: process.env.DISCORD_CLIENT_SECRET,
    botToken: process.env.DISCORD_BOT_TOKEN,
  },
};

if (process.env.YOUTUBE_API_KEY) {
  config.youtube = {
    apiKey: process.env.YOUTUBE_API_KEY,
  };
}

if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
  config.app.sentry = {
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  };
}

export default config;
