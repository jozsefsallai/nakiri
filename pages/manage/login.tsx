import Head from 'next/head';

import BoxLayout from '@/layouts/BoxLayout';
import Button from '@/components/common/button/Button';

import { signIn } from 'next-auth/client';

const LoginPage = () => {
  return (
    <>
      <Head>
        <title>Log in</title>
      </Head>

      <BoxLayout>
        <section className="text-center">
          <div>
            <Button onClick={() => signIn('discord')}>
              Log in via Discord
            </Button>
          </div>
        </section>
      </BoxLayout>
    </>
  );
};

export default LoginPage;
