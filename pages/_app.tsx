import '@/styles/base.scss';

import { UserProvider } from '@/components/providers/CurrentUserProvider';

import Router from 'next/router';
import NProgress from 'nprogress';
import ToastContainer from '@/components/common/toasts/ToastContainer';

Router.events.on('routeChangeStart', NProgress.start);
Router.events.on('routeChangeComplete', NProgress.done);
Router.events.on('routeChangeError', NProgress.done);

const App = ({ Component, pageProps }) => {
  return (
    <UserProvider>
      <main className="app">
        <Component {...pageProps} />
        <ToastContainer />
      </main>
    </UserProvider>
  );
};

export default App;
