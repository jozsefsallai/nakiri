import MessageBox, {
  MessageBoxLevel,
} from '@/components/common/messagebox/MessageBox';
import Loading from '@/components/loading/Loading';
import { IYouTubeChannelID } from '@/db/models/blacklists/YouTubeChannelID';
import DashboardLayout from '@/layouts/DashboardLayout';
import Blacklist, { IFetcherOptions } from '@/components/blacklist/Blacklist';
import YouTubeChannelEntry from '@/components/blacklist/entry-data/YouTubeChannelEntry';

import apiService from '@/services/apis';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useUserGroups } from '@/hooks/useGroups';

import Swal from 'sweetalert2';
import toaster from '@/lib/toaster';
import { errors } from '@/lib/errors';
import { APIPaginationData } from '@/services/axios';

const InfoBox = () => (
  <>
    <p>
      Here you can manage the YouTube channel blacklists. These blacklists will
      be used to filter out YouTube channel IDs (i.e. channels that frequently
      upload videos that you wouldn't want to be posted in your server).
    </p>
    <p>
      <strong>Note:</strong> when you add a new entry, the channel's metadata
      will be collected for it. It will also be periodically updated and removed
      from the blacklist if the channel is no longer available.
    </p>
  </>
);

const ManageChannelsIndexPage = () => {
  const { groups, errored } = useUserGroups();
  const [items, setItems] = useState<IYouTubeChannelID[] | null>(null);
  const [pagination, setPagination] = useState<APIPaginationData | null>(null);
  const [error, setError] = useState<string>('');

  const router = useRouter();

  const fetchItems = async ({ group, guild, page }: IFetcherOptions = {}) => {
    setItems(null);
    setPagination(null);
    setError('');

    try {
      const { channelIDs, pagination } =
        await apiService.channelIDs.getChannelIDs({ group, guild, page });
      setItems(channelIDs);
      setPagination(pagination);
    } catch (err) {
      setError('Failed to load channel IDs.');
    }
  };

  const deleteItem = async (id: string) => {
    try {
      await apiService.channelIDs.deleteChannelID(id);
      setItems((items) => items.filter((channel) => channel.id !== id));
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
      cancelButtonText: 'Cancel',
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
      cancelButtonText: 'No',
    });

    if (result.isConfirmed) {
      window.open(url, '_blank');
    }
  };

  useEffect(() => {
    if (errored) {
      setError('Failed to fetch your groups.');
    }
  }, [errored]);

  return (
    <DashboardLayout
      hasContainer
      title="Blacklisted YouTube Channel IDs"
      infoBox={<InfoBox />}
      buttonText="Add channel ID"
      onButtonClick={handleNewButtonClick}
    >
      {groups && (
        <Blacklist
          items={items}
          pagination={pagination}
          fetcher={fetchItems}
          error={error}
          zdsMessage="No blacklisted channel IDs have been found."
          groups={groups}
          onTextClick={handleTextClick}
          actions={[{ label: 'Delete', onClick: handleDeleteActionClick }]}
          entryComponent={YouTubeChannelEntry}
        />
      )}

      {groups === null && !error && <Loading />}
      {groups === null && error.length > 0 && (
        <MessageBox level={MessageBoxLevel.DANGER} message={error} />
      )}
    </DashboardLayout>
  );
};

export default ManageChannelsIndexPage;
