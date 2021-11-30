import MessageBox, {
  MessageBoxLevel,
} from '@/components/common/messagebox/MessageBox';
import Loading from '@/components/loading/Loading';
import DashboardLayout from '@/layouts/DashboardLayout';

import { useRouter } from 'next/router';
import { useUserGroups } from '@/hooks/useGroups';

import GroupList from '@/components/groups/GroupList';

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
