import MessageBox, {
  MessageBoxLevel,
} from '@/components/common/messagebox/MessageBox';
import Loading from '@/components/loading/Loading';
import DashboardLayout from '@/layouts/DashboardLayout';

import { useRouter } from 'next/router';
import { useUserGroups } from '@/hooks/useGroups';

import GroupList from '@/components/groups/GroupList';

const InfoBox = () => (
  <>
    <p>
      In this section, you will be able to view the groups that you have access
      to and create new groups yourself.
    </p>
    <p>
      Groups are Nakiri's way of organizing API access across multiple guilds
      and users/clients. You can learn more about groups in the{' '}
      <a href="/docs/groups/what-are-groups" target="_blank">
        Nakiri documentation
      </a>
      .
    </p>
  </>
);

const ManageGroupsPage: React.FC = () => {
  const { groups, errored } = useUserGroups();

  const router = useRouter();

  const handleNewButtonClick = () => {
    router.push('/manage/groups/new');
  };

  return (
    <DashboardLayout
      hasContainer
      title="Groups"
      infoBox={<InfoBox />}
      buttonText="Create Group"
      onButtonClick={handleNewButtonClick}
    >
      {groups && <GroupList groups={groups} />}
      {groups === null && !errored && <Loading />}
      {errored && (
        <MessageBox
          level={MessageBoxLevel.DANGER}
          message="Failed to fetch your groups."
        />
      )}
    </DashboardLayout>
  );
};

export default ManageGroupsPage;
