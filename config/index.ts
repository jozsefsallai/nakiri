import { IConfig } from './IConfig';

const config: IConfig = {
  app: {
    protocol: process.env.PROTOCOL,
    domain: process.env.DOMAIN,
    port: process.env.PORT && parseInt(process.env.PORT, 10)
  },

  database: {
    dialect: process.env.DATABASE_DIALECT,
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT && parseInt(process.env.DATABASE_PORT, 10),
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    name: process.env.DATABASE_NAME
  },

  discord: {
    clientId: process.env.DISCORD_CLIENT_ID,
    clientSecret: process.env.DISCORD_CLIENT_SECRET,
    botToken: process.env.DISCORD_BOT_TOKEN
  }
};

export default config;
