import MessageBox, { MessageBoxLevel } from '@/components/common/messagebox/MessageBox';
import Button, { ButtonSize } from '@/components/common/button/Button';
import Loading from '@/components/loading/Loading';
import { IMonitoredKeyword } from '@/db/models/keywords/MonitoredKeyword';
import DashboardLayout from '@/layouts/DashboardLayout';
import Blacklist from '@/components/blacklist/Blacklist';

import { redirectIfDoesNotHavePermission } from '@/lib/redirects';
import { UserPermissions } from '@/lib/UserPermissions';

import apiService from '@/services/apis';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useState } from 'react';

import { IGuild } from '@/controllers/guilds/IGuild';
import toaster from '@/lib/toaster';
import { errors } from '@/lib/errors';
import Swal from 'sweetalert2';

const ManageMonitoredKeywordsIndexPage = () => {
  const [items, setItems] = useState<IMonitoredKeyword[] | null>(null);
  const [guilds, setGuilds] = useState<IGuild[] | null>(null);
  const [error, setError] = useState<string>('');

  const router = useRouter();

  const fetchGuilds = async () => {
    setGuilds(null);
    setError('');

    try {
      const { guilds } = await apiService.guilds.getGuilds();
      setGuilds(guilds);
    } catch (err) {
      setError('Failed to fetch guilds.');
    }
  };

  const fetchItems = async (guild: string) => {
    setItems(null);
    setError('');

    try {
      const { entries } = await apiService.monitoredKeywords.getMonitoredKeywords(guild);
      setItems(entries);
    } catch (err) {
      setError('Failed to load monitored keywords.');
    }
  };

  const deleteItem = async (id: string) => {
    try {
      await apiService.monitoredKeywords.deleteMonitoredKeyword(id);
      setItems(items => items.filter(item => item.id !== id));
      toaster.success('Monitored keyword deleted successfully.');
    } catch (err) {
      const message = err?.response?.data?.error;

      if (message) {
        toaster.danger(errors[message]);
        return;
      }

      toaster.danger(errors.INTERNAL_SERVER_ERROR);
    }
  };

  const handleNewButtonClick = () => {
    router.push('/manage/monitored-keywords/new');
  };

  const handleWhitelistsClick = () => {
    router.push('/manage/monitored-keywords/whitelisted-channels');
  };

  const handleEditActionClick = async (id: string) => {
    router.push(`/manage/monitored-keywords/${id}/edit`);
  };

  const handleDeleteActionClick = async (id: string) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'You are about to delete this monitored keyword AND every entry associated to it. This cannot be undone!',
      showCancelButton: true,
      confirmButtonText: 'Delete keyword and entries',
      cancelButtonText: 'Cancel'
    });

    if (result.isConfirmed) {
      await deleteItem(id);
    }
  };

  const handleTextClick = async (text: string) => {
    const entry = items.find(item => item.keyword === text);
    await router.push(`/manage/monitored-keywords/${entry.id}`);
  };

  useEffect(() => {
    fetchGuilds();
  }, []);

  return (
    <DashboardLayout hasContainer title="Monitored Keywords" buttonText="Add keyword" onButtonClick={handleNewButtonClick}>
      <Button size={ButtonSize.SMALL} onClick={handleWhitelistsClick}>Manage Whitelisted Channels</Button>

      {guilds && (
        <Blacklist
          items={items}
          fetcher={fetchItems}
          error={error}
          zdsMessage="No monitored keywords have been found."
          guilds={guilds}
          onTextClick={handleTextClick}
          hideGlobal
          actions={[
            { label: 'Edit', onClick: handleEditActionClick },
            { label: 'Delete', onClick: handleDeleteActionClick }
          ]}
        />
      )}

      {guilds === null && !error && <Loading />}
      {guilds === null && error.length > 0 && <MessageBox level={MessageBoxLevel.DANGER} message={error} />}
    </DashboardLayout>
  );
};

export const getServerSideProps = async ({ req, res }) => {
  await redirectIfDoesNotHavePermission(req, res, UserPermissions.MANAGE_MONITORED_KEYWORDS);
  return {
    props: {}
  };
};

export default ManageMonitoredKeywordsIndexPage;
