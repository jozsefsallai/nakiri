import DashboardLayout from '@/layouts/DashboardLayout';

import { redirectIfAnonmyous } from '@/lib/redirects';

const ManagePatternsIndexPage = () => {
  return (
    <DashboardLayout hasContainer>
      This page is the same as the YouTube video ID blacklist management page,
      except it's for link regex patterns instead. There might be a possibility
      to test each regex with a given text, to see if it matches anything.
    </DashboardLayout>
  );
};

export const getServerSideProps = async ({ req, res }) => {
  await redirectIfAnonmyous(req, res);
  return {
    props: {}
  };
};

export default ManagePatternsIndexPage;
