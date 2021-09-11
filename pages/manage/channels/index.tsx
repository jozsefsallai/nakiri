import MessageBox, { MessageBoxLevel } from '@/components/common/messagebox/MessageBox';
import Loading from '@/components/loading/Loading';
import { IYouTubeChannelID } from '@/db/models/blacklists/YouTubeChannelID';
import DashboardLayout from '@/layouts/DashboardLayout';
import Blacklist, { IFetcherOptions } from '@/components/blacklist/Blacklist';
import YouTubeChannelEntry from '@/components/blacklist/entry-data/YouTubeChannelEntry';

import { redirectIfAnonmyous } from '@/lib/redirects';
import apiService from '@/services/apis';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useGuilds } from '@/hooks/useGuilds';

import Swal from 'sweetalert2';
import toaster from '@/lib/toaster';
import { errors } from '@/lib/errors';
import { APIPaginationData } from '@/services/axios';

const ManageChannelsIndexPage = () => {
  const [guilds, _, guildsErrored] = useGuilds();
  const [items, setItems] = useState<IYouTubeChannelID[] | null>(null);
  const [pagination, setPagination] = useState<APIPaginationData | null>(null);
  const [error, setError] = useState<string>('');

  const router = useRouter();

  const fetchItems = async ({ guild, page }: IFetcherOptions = {}) => {
    setItems(null);
    setPagination(null);
    setError('');

    try {
      const { channelIDs, pagination } = await apiService.channelIDs.getChannelIDs({ guild, page });
      setItems(channelIDs);
      setPagination(pagination);
    } catch (err) {
      setError('Failed to load channel IDs.');
    }
  };

  const deleteItem = async (id: string) => {
    try {
      await apiService.channelIDs.deleteChannelID(id);
      setItems(items => items.filter(channel => channel.id !== id));
      toaster.success('Channel ID deleted successfully!');
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
    router.push('/manage/channels/new');
  };

  const handleDeleteActionClick = async (id: string) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'You are about to delete this channel ID. This cannot be undone!',
      showCancelButton: true,
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel'
    });

    if (result.isConfirmed) {
      await deleteItem(id);
    }
  };

  const handleTextClick = async (text: string) => {
    const url = `https://youtube.com/channel/${text}`;

    const result = await Swal.fire({
      title: 'Confirm action',
      text: `Are you sure you want to open the following URL: ${url}?`,
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    });

    if (result.isConfirmed) {
      window.open(url, '_blank');
    }
  };

  useEffect(() => {
    if (guildsErrored) {
      setError('Failed to fetch your guilds.');
    }
  }, [ guildsErrored ]);

  return (
    <DashboardLayout hasContainer title="Blacklisted YouTube Channel IDs" buttonText="Add channel ID" onButtonClick={handleNewButtonClick}>
      {guilds && (
        <Blacklist
          items={items}
          pagination={pagination}
          fetcher={fetchItems}
          error={error}
          zdsMessage="No blacklisted channel IDs have been found."
          guilds={guilds}
          onTextClick={handleTextClick}
          actions={[
            { label: 'Delete', onClick: handleDeleteActionClick }
          ]}
          entryComponent={YouTubeChannelEntry}
        />
      )}

      {guilds === null && !error && <Loading />}
      {guilds === null && error.length > 0 && <MessageBox level={MessageBoxLevel.DANGER} message={error} />}
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
