import DashboardLayout from '@/layouts/DashboardLayout';

import { redirectIfAnonmyous } from '@/lib/redirects';

const ManageVideosIndexPage = () => {
  return (
    <DashboardLayout hasContainer>
      This page will contain a list of blacklisted YouTube video IDs. The user
      can filter the currently displayed blacklists (there will be a sidebar
      that allows them to switch between the global blacklist and individual
      per-guild blacklists). There will also be a very minimal search feature.
      There will also be an "Add" button for adding new video IDs.
    </DashboardLayout>
  );
};

export const getServerSideProps = async ({ req, res }) => {
  await redirectIfAnonmyous(req, res);
  return {
    props: {}
  };
};

export default ManageVideosIndexPage;
