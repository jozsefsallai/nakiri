require('ts-node/register');
require('dotenv').config();

const inquirer = require('inquirer');

const db = require('../services/db').default;
const { Key } = require('../db/models/auth/Key');
const uuid = require('uuid').v4;

(async () => {
  await db.prepare();
  const keyRepository = db.getRepository(Key);

  const { guildId } = await inquirer.prompt([
    {
      type: 'input',
      name: 'guildId',
      message: 'ID of guild where the key will be used:'
    }
  ]);

  const current = await keyRepository.findOne({ guildId });
  if (current) {
    console.warn(`An API key for guild ${guildId} already exists!`);

    const { overwrite } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'overwrite',
        message: 'Overwrite it?'
      }
    ]);

    if (!overwrite) {
      return current.key;
    }

    await keyRepository.remove(current);
  }

  let key = '';

  do {
    key = uuid();
  } while ((await keyRepository.count({ key })) !== 0);

  const entry = new Key();
  entry.key = key;
  entry.guildId = guildId;
  await keyRepository.insert(entry);

  return key;
})().then(key => {
  console.log(`Your key is: ${key}`);
  process.exit(0);
}).catch(console.error);
