require('ts-node/register');
require('dotenv').config();

const inquirer = require('inquirer');
const fs = require('fs');

const db = require('../services/db').default;
const { YouTubeVideoID } = require('../db/models/blacklists/YouTubeVideoID');
const { YouTubeChannelID } = require('../db/models/blacklists/YouTubeChannelID');
const { LinkPattern } = require('../db/models/blacklists/LinkPattern');

const databases = [
  {
    name: 'YouTube video IDs',
    value: {
      model: YouTubeVideoID,
      fieldName: 'videoId'
    }
  },
  {
    name: 'YouTube channel IDs',
    value: {
      model: YouTubeChannelID,
      fieldName: 'channelId'
    }
  },
  {
    name: 'Link patterns',
    value: {
      model: LinkPattern,
      fieldName: 'pattern'
    }
  }
];

(async () => {
  await db.prepare();

  const { database: { model, fieldName }, filepath } = await inquirer.prompt([
    {
      type: 'list',
      name: 'database',
      message: 'Database type:',
      choices: databases
    },
    {
      type: 'input',
      name: 'filepath',
      message: 'Path to database:'
    }
  ]);

  const repository = db.getRepository(model);

  if (!fs.existsSync(filepath)) {
    throw new Error('The specified input file does not exist.');
  }

  const raw = fs.readFileSync(filepath, { encoding: 'utf8' });
  const lines = raw
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0);

  for await (const line of lines) {
    const entry = new model();
    entry[fieldName] = line;
    await repository.insert(entry);
    console.log(`Added entry ${line}.`);
  }
})().then(() => {
  console.log('Done!');
  process.exit(0);
}).catch(console.error);
