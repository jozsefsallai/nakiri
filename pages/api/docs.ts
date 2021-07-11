import bar from 'next-bar';
import * as fs from 'fs';
import * as path from 'path';

import { ensureAuthenticated } from '@/middleware/auth';

export default bar({
  get: ensureAuthenticated(async (req, res) => {
    const insomniaFile = fs.createReadStream(path.join(process.cwd(), 'insomnia.json'));
    insomniaFile.pipe(res);
  }, true)
});
