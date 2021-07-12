require('ts-node/register');
require('dotenv').config();

const inquirer = require('inquirer');

const db = require('../services/db').default;
const { AuthorizedUser } = require('../db/models/auth/AuthorizedUser');
const { UserPermissions } = require('../lib/UserPermissions');

(async () => {
  await db.prepare();
  const authorizedUserRepository = db.getRepository(AuthorizedUser);

  const { discordId, permissionsList } = await inquirer.prompt([
    {
      type: 'input',
      name: 'discordId',
      message: 'Discord ID:'
    },
    {
      type: 'checkbox',
      name: 'permissionsList',
      message: 'Permissions:',
      choices: Object.keys(UserPermissions)
        .filter(value => !isNaN(Number(value)))
        .map(key => {
          return {
            name: UserPermissions[key],
            value: Number(key)
          };
        })
    }
  ]);

  const userCount = await authorizedUserRepository.count({ discordId });

  if (userCount > 0) {
    throw new Error('User already added to the list of authorized users.');
  }

  const permissions = permissionsList.length === 0
    ? 1
    : permissionsList.reduce((a, b) => a + b);

  const user = new AuthorizedUser();
  user.discordId = discordId;
  user.permissions = permissions;

  await authorizedUserRepository.insert(user);
  return {
    discordId,
    permissions: permissionsList.length === 0
      ? [ UserPermissions.MANAGE_OWN_GUILD_BLACKLISTS ]
      : permissionsList
  };
})().then(({ discordId, permissions }) => {
  console.log(`Authorized Discord user with ID ${discordId} with the following permissions:`);
  permissions.forEach(permission => console.log(`  - ${UserPermissions[permission]}`));
  process.exit(0);
}).catch(console.error);
