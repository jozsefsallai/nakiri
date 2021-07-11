require('ts-node/register');

const { connectionOptions } = require('./services/db');

const ormconfig = {
  ...connectionOptions,

  migrations: [
    'db/migrations/**/*.ts'
  ],

  cli: {
    migrationsDir: 'db/migrations'
  }
};

module.exports = ormconfig;
