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
import toaster from '@/lib/toaster';
import { errors } from '@/lib/errors';

import Swal from 'sweetalert2';

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

  const unauthorizeUser = async (id: string) => {
    try {
      await apiService.users.unauthorizeUser(id);
      toaster.success('User unauthorized successfully!');
      setUsers(users => users.filter(user => user.id !== id));
    } catch (err) {
      const message = err?.response?.data?.error;

      if (message) {
        toaster.danger(message);
        return;
      }

      toaster.danger(errors.INTERNAL_SERVER_ERROR);
    }
  };

  const handleUserPermissionsUpdate = async (id: string, permissions: number[]) => {
    try {
      const { user } = await apiService.users.updateUserPermissions({ id, permissions });
      setUsers(users.map(u => u.id === user.id ? user : u));
      toaster.success('User permissions updated successfully!');
    } catch (err) {
      const message = err?.response?.data?.error;

      if (message) {
        toaster.danger(errors[message]);
        return;
      }

      toaster.danger(errors.INTERNAL_SERVER_ERROR);
    }
  };

  const handleUnauthorizeUser = async (user: IAuthorizedUser) => {
    const result = await Swal.fire({
      title: 'Are you sure you want to unauthorize this user?',
      text: `This will revoke ${user.name}#${user.discriminator}'s access to the management panel, but will not remove any API keys or entries they've created.`,
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    });

    if (result.isConfirmed) {
      await unauthorizeUser(user.id);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <DashboardLayout hasContainer title="Authorized Users" buttonText="Add User" onButtonClick={handleNewButtonClick}>
      {users && users.length > 0 && <UserList
        users={users}
        onUpdateUserPermissions={handleUserPermissionsUpdate}
        onUnauthorizeUser={handleUnauthorizeUser}
      />}
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
