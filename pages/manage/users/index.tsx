import MessageBox, { MessageBoxLevel } from '@/components/common/messagebox/MessageBox';
import ZeroDataState from '@/components/common/zds/ZeroDataState';
import Loading from '@/components/loading/Loading';
import { IAuthorizedUser } from '@/db/models/auth/AuthorizedUser';
import DashboardLayout from '@/layouts/DashboardLayout';
import UserList from '@/components/users/UserList';

import { redirectIfDoesNotHavePermission } from '@/lib/redirects';
import { UserPermissions } from '@/lib/UserPermissions';
import apiService from '@/services/apis';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useState } from 'react';

const ManageUsersIndexPage = () => {
  const [ users, setUsers ] = useState<IAuthorizedUser[] | null>(null);
  const [ error, setError ] = useState<string>('');

  const router = useRouter();

  const fetchUsers = async () => {
    setUsers(null);
    setError('');

    try {
      const { users } = await apiService.users.getAuthorizedUsers();
      setUsers(users);
    } catch (err) {
      setError('Failed to load authorized users.');
    }
  };

  const handleNewButtonClick = () => {
    router.push('/manage/users/new');
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <DashboardLayout hasContainer title="Authorized Users" buttonText="Add User" onButtonClick={handleNewButtonClick}>
      {users && users.length > 0 && <UserList users={users} />}
      {users && users.length === 0 && <ZeroDataState message="No authorized users found. Which is weird, because you're here." />}

      {!users && !error && <Loading />}
      {error.length > 0 && <MessageBox level={MessageBoxLevel.DANGER} message={error} />}
    </DashboardLayout>
  );
};

export const getServerSideProps = async ({ req, res }) => {
  await redirectIfDoesNotHavePermission(req, res, UserPermissions.MANAGE_AUTHORIZED_USERS);
  return {
    props: {}
  };
};

export default ManageUsersIndexPage;
