import MessageBox, { MessageBoxLevel } from '@/components/common/messagebox/MessageBox';
import Loading from '@/components/loading/Loading';
import { IGroup } from '@/db/models/groups/Group';
import DashboardLayout from '@/layouts/DashboardLayout';

import { redirectIfAnonmyous } from '@/lib/redirects';
import apiService from '@/services/apis';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import GroupList from '@/components/groups/GroupList';

const ManageGroupsPage: React.FC = () => {
  const [ groups, setGroups ] = useState<IGroup[] | null>(null);
  const [ error, setError ] = useState<string>('');

  const router = useRouter();

  const fetchGroups = async () => {
    setGroups(null);
    setError('');

    try {
      const { groups } = await apiService.groups.getGroups();
      setGroups(groups);
    } catch (err) {
      setError('Failed to fetch your groups.');
    }
  };

  const handleNewButtonClick = () => {
    router.push('/manage/groups/new');
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  return (
    <DashboardLayout hasContainer title="Groups" buttonText="Create Group" onButtonClick={handleNewButtonClick}>
      {groups && <GroupList groups={groups} />}
      {groups === null && !error && <Loading />}
      {groups === null && error.length > 0 && <MessageBox level={MessageBoxLevel.DANGER} message={error} />}
    </DashboardLayout>
  );
};

export const getServerSideProps = async ({ req, res }) => {
  await redirectIfAnonmyous(req, res);
  return { props: {} };
};

export default ManageGroupsPage;
