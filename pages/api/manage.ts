import bar from 'next-bar';

import { getSession } from 'next-auth/client';

export default bar({
  get: async (req, res) => {
    const session = await getSession({ req });

    if (session) {
      res.redirect(302, '/manage/home');
      return;
    }

    res.redirect(302, '/manage/login');
  }
});
