import { redirectIfAnonmyous } from '@/lib/redirects';
import Button, { ButtonSize } from '@/components/common/Button';

import { signOut } from 'next-auth/client';
import { useCurrentUser } from '@/hooks/useCurrentUser';

const DashboardHomePage = () => {
  const [ currentUser, _ ] = useCurrentUser();

  return (
    <div>
      {currentUser && (
        <div>
          Hello, {currentUser.name}#{currentUser.discriminator}
          <Button size={ButtonSize.SMALL} onClick={() => signOut()}>Log out</Button>
        </div>
      )}

      {!currentUser && <>Loading...</>}
    </div>
  );
};

export const getServerSideProps = async ({ req, res }) => {
  await redirectIfAnonmyous(req, res);
  return {
    props: {}
  };
};

export default DashboardHomePage;
