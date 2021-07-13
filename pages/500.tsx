import Head from 'next/head';

import BoxLayout from '@/layouts/BoxLayout';

const ServerErrorPage = () => {
  return (
    <>
      <Head>
        <title>404</title>
      </Head>

      <BoxLayout>
        <div className="text-center">
          <h1 className="text-ayame-primary">Yo dahell.</h1>
          <p>Something yabe happened.</p>
        </div>
      </BoxLayout>
    </>
  );
};

export default ServerErrorPage;
