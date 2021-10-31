import dotenv from 'dotenv';
dotenv.config();

import server from './server';

server().catch((err) => {
  console.error(err);
  process.exit(1);
});
