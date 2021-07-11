export interface IAppConfig {
  protocol: string;
  domain: string;
  port: number;
};

export interface IDatabaseConfig {
  dialect: string;
  host: string;
  port: number;
  username: string;
  password: string;
  name: string;
};

export interface IDiscordConfig {
  clientId: string;
  clientSecret: string;
};

export interface IConfig {
  app: IAppConfig;
  database: IDatabaseConfig;
  discord: IDiscordConfig;
};
