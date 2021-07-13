import Head from 'next/head';

import BoxLayout from '@/layouts/BoxLayout';

const NotFoundPage = () => {
  return (
    <>
      <Head>
        <title>404</title>
      </Head>

      <BoxLayout>
        <div className="text-center">
          <h1 className="text-ayame-primary">Yo dahell.</h1>
          <p>That page doesn't exist yo.</p>
        </div>
      </BoxLayout>
    </>
  );
};

export default NotFoundPage;
