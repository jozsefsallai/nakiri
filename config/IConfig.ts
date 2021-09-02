export interface ISentryConfig {
  dsn: string;
};

export interface IAppConfig {
  protocol: string;
  domain: string;
  port: number;
  sessionSecret: string;
  cookieSecret: string;
  sentry?: ISentryConfig;
};

export interface IDatabaseConfig {
  dialect: string;
  host: string;
  port: number;
  username: string;
  password: string;
  name: string;
};

export interface IRedisConfig {
  host: string;
  port: number;
  password?: string;

  buildRedisUrl(database?: number): string;
};

export interface IDiscordConfig {
  clientId: string;
  clientSecret: string;
  botToken: string;
};

export interface IYouTubeConfig {
  apiKey: string;
};

export interface IConfig {
  app: IAppConfig;
  database: IDatabaseConfig;
  redis: IRedisConfig;
  discord: IDiscordConfig;
  youtube?: IYouTubeConfig;
};
