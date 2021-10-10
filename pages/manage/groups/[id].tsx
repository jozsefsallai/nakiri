import MessageBox, {
  MessageBoxLevel,
} from '@/components/common/messagebox/MessageBox';
import Group from '@/components/groups/group-page';
import Loading from '@/components/loading/Loading';
import { IGroup } from '@/db/models/groups/Group';
import DashboardLayout from '@/layouts/DashboardLayout';

import { redirectIfAnonmyous } from '@/lib/redirects';
import apiService from '@/services/apis';

import { useEffect, useState } from 'react';

interface GroupPageProps {
  id: string;
}

const GroupPage: React.FC<GroupPageProps> = ({ id }) => {
  const [group, setGroup] = useState<IGroup | null>(null);
  const [title, setTitle] = useState('Loading group...');
  const [error, setError] = useState<string>('');

  const fetchGroup = async () => {
    setGroup(null);
    setError('');

    try {
      const { group } = await apiService.groups.getGroup(id);
      setGroup(group);
      setTitle(group.name);
    } catch (err) {
      const message = err.response?.data?.error;
      setError(message || 'An error occurred while fetching the group.');
      setTitle('Error');
    }
  };

  useEffect(() => {
    fetchGroup();
  }, []);

  return (
    <DashboardLayout title={title}>
      {group && <Group group={group} setGroup={setGroup} />}

      {!group && !error && <Loading />}
      {!group && error && (
        <MessageBox level={MessageBoxLevel.DANGER}>{error}</MessageBox>
      )}
    </DashboardLayout>
  );
};

export const getServerSideProps = async ({ req, res, query }) => {
  await redirectIfAnonmyous(req, res);
  const { id } = query;

  return {
    props: {
      id,
    },
  };
};

export default GroupPage;
