import Head from 'next/head';

const Home = () => {
  return (
    <>
      <Head>
        <title>Yo dazo!</title>
      </Head>

      <section className="flex p-5 h-screen items-center justify-center">
        <h1 className="text-ayame-primary">Yo dazo!</h1>
      </section>
    </>
  );
};

export default Home;
