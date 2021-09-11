import '@/styles/base.scss';

import { UserProvider } from '@/components/providers/CurrentUserProvider';
import { GuildsProvider } from '@/components/providers/GuildsProvider';
import { GroupsProvider } from '@/components/providers/GroupsProvider';

import Router from 'next/router';
import NProgress from 'nprogress';
import ToastContainer from '@/components/common/toasts/ToastContainer';

Router.events.on('routeChangeStart', NProgress.start);
Router.events.on('routeChangeComplete', NProgress.done);
Router.events.on('routeChangeError', NProgress.done);

const App = ({ Component, pageProps }) => {
  return (
    <UserProvider>
      <GuildsProvider>
        <GroupsProvider>
          <main className="app">
            <Component {...pageProps} />
            <ToastContainer />
          </main>
        </GroupsProvider>
      </GuildsProvider>
    </UserProvider>
  );
};

export default App;
