# nakiriapi

Centralized blacklist database, API, and management panel primarily intended for
use in Hololive fan Discord servers.

## Requirements

- Node.js v12 or newer
- MySQL (other databases might work but I have not tested it)

## Getting Started

**1. Clone the repository:**

```
git clone git@github.com:jozsefsallai/nakiri.git
cd nakiri
```

**2. Install the dependencies:**

```
npm i -g yarn
yarn
```

**3. Create a user and a database:**

(instructions are for MySQL, if you're using a different database driver, the
steps should be similar)

```
mysql -u root -p
```

```sql
CREATE USER ayame@localhost IDENTIFIED BY 'nakiri';
CREATE DATABASE nakiriapi;
GRANT ALL PRIVILEGES ON nakiriapi.* TO ayame@localhost WITH GRANT OPTION;
FLUSH PRIVILEGES;
exit;
```

**4. Create a dotenv config:**

```
cp .env.example .env
nvim .env
```

**5. Run the migrations:**

```
yarn migrate
```

**6. Authorize the first Discord user:**

```
node bin/authorizeUser
```

It is recommended that you grant all permissions to the first user.

**7. Start the dev server:**

```
yarn dev
```

**8. Build for production:**

```
yarn build
yarn start
```

## Useful Commands

### Linting

```
yarn lint
```

### Generating Migrations

```
yarn migration:generate NameOfMigration
```

### Migration Rollback

```
yarn migration:rollback
```

## License

The source code of this app is licensed under MIT. Refer to the LICENSE file for
more details.
