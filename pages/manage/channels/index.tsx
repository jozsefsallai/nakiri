import DashboardLayout from '@/layouts/DashboardLayout';

import { redirectIfAnonmyous } from '@/lib/redirects';

const ManageChannelsIndexPage = () => {
  return (
    <DashboardLayout hasContainer>
      This page is the same as the YouTube video ID blacklist management page,
      except it's for channel IDs instead.
    </DashboardLayout>
  );
};

export const getServerSideProps = async ({ req, res }) => {
  await redirectIfAnonmyous(req, res);
  return {
    props: {}
  };
};

export default ManageChannelsIndexPage;
