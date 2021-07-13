import '@/styles/base.scss';

import { UserProvider } from '@/components/providers/CurrentUserProvider';

import Router from 'next/router';
import NProgress from 'nprogress';

Router.events.on('routeChangeStart', NProgress.start);
Router.events.on('routeChangeComplete', NProgress.done);
Router.events.on('routeChangeError', NProgress.done);

const App = ({ Component, pageProps }) => {
  return (
    <UserProvider>
      <main className="app">
        <Component {...pageProps} />
      </main>
    </UserProvider>
  );
};

export default App;
