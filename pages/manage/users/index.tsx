import DashboardLayout from '@/layouts/DashboardLayout';

import { redirectIfAnonmyous } from '@/lib/redirects';

const ManageChannelsIndexPage = () => {
  return (
    <DashboardLayout hasContainer>
      Only users who can manage the list of authorized users can access this
      page. This will display all users who have access to the app. The list
      will have an edit button (for editing permissions) and a delete button
      (to completely revoke a user's access to the panel). There will also be a
      button for authorizing a new Discord user.
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
