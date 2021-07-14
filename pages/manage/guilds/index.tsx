import DashboardLayout from '@/layouts/DashboardLayout';

import { redirectIfAnonmyous } from '@/lib/redirects';

const ManageGuildsIndexPage = () => {
  return (
    <DashboardLayout hasContainer>
      This page will contain a list of all Discord servers the current user is
      an admin/moderator of AND have API keys. It will also contain a button
      that would allow the user to add a new server and generate an API key for
      it.
    </DashboardLayout>
  );
};

export const getServerSideProps = async ({ req, res }) => {
  await redirectIfAnonmyous(req, res);
  return {
    props: {}
  };
};

export default ManageGuildsIndexPage;
