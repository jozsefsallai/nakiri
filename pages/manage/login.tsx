import Head from 'next/head';

import BoxLayout from '@/layouts/BoxLayout';
import Button from '@/components/common/button/Button';

import { redirectIfAuthenticated } from '@/lib/redirects';

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

export const getServerSideProps = async ({ req, res }) => {
  await redirectIfAuthenticated(req, res);
  return {
    props: {},
  };
};

export default LoginPage;
