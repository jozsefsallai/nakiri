import MessageBox, {
  MessageBoxLevel,
} from '@/components/common/messagebox/MessageBox';
import Button, { ButtonSize } from '@/components/common/button/Button';
import Loading from '@/components/loading/Loading';
import { IMonitoredKeyword } from '@/db/models/keywords/MonitoredKeyword';
import DashboardLayout from '@/layouts/DashboardLayout';
import Blacklist, { IFetcherOptions } from '@/components/blacklist/Blacklist';

import apiService from '@/services/apis';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useGuilds } from '@/hooks/useGuilds';

import toaster from '@/lib/toaster';
import { errors } from '@/lib/errors';
import Swal from 'sweetalert2';

const InfoBox = () => (
  <>
    <p>
      In this section you can manage the monitored keywords for your guild.
      These keywords will be scanned on a regular basis to inform about new
      YouTube videos that contain them.
    </p>
    <p>
      For more information about monitored keywords, please refer to the{' '}
      <a href="/docs/workers" target="_blank">
        Nakiri Developer Documentation
      </a>
      .
    </p>
  </>
);

const ManageMonitoredKeywordsIndexPage = () => {
  const [items, setItems] = useState<IMonitoredKeyword[] | null>(null);
  const [guilds, _, guildsErrored] = useGuilds();
  const [error, setError] = useState<string>('');

  const router = useRouter();

  const fetchItems = async ({ guild }: IFetcherOptions = {}) => {
    setItems(null);
    setError('');

    try {
      const { entries } =
        await apiService.monitoredKeywords.getMonitoredKeywords(guild);
      setItems(entries);
    } catch (err) {
      setError('Failed to load monitored keywords.');
    }
  };

  const deleteItem = async (id: string) => {
    try {
      await apiService.monitoredKeywords.deleteMonitoredKeyword(id);
      setItems((items) => items.filter((item) => item.id !== id));
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
      cancelButtonText: 'Cancel',
    });

    if (result.isConfirmed) {
      await deleteItem(id);
    }
  };

  const handleTextClick = async (text: string) => {
    const entry = items.find((item) => item.keyword === text);
    await router.push(`/manage/monitored-keywords/${entry.id}`);
  };

  useEffect(() => {
    if (guildsErrored) {
      setError('Failed to fetch your guilds.');
    }
  }, [guildsErrored]);

  return (
    <DashboardLayout
      hasContainer
      title="Monitored Keywords"
      infoBox={<InfoBox />}
      buttonText="Add keyword"
      onButtonClick={handleNewButtonClick}
    >
      <Button size={ButtonSize.SMALL} onClick={handleWhitelistsClick}>
        Manage Whitelisted Channels
      </Button>

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
            { label: 'Delete', onClick: handleDeleteActionClick },
          ]}
        />
      )}

      {guilds === null && !error && <Loading />}
      {guilds === null && error.length > 0 && (
        <MessageBox level={MessageBoxLevel.DANGER} message={error} />
      )}
    </DashboardLayout>
  );
};

export default ManageMonitoredKeywordsIndexPage;
