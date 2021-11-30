import MessageBox, {
  MessageBoxLevel,
} from '@/components/common/messagebox/MessageBox';
import Loading from '@/components/loading/Loading';
import { IYouTubeVideoID } from '@/db/models/blacklists/YouTubeVideoID';
import DashboardLayout from '@/layouts/DashboardLayout';
import Blacklist, { IFetcherOptions } from '@/components/blacklist/Blacklist';
import YouTubeVideoEntry from '@/components/blacklist/entry-data/YouTubeVideoEntry';

import apiService from '@/services/apis';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useUserGroups } from '@/hooks/useGroups';

import Swal from 'sweetalert2';
import toaster from '@/lib/toaster';
import { errors } from '@/lib/errors';
import { APIPaginationData } from '@/services/axios';

const ManageVideosIndexPage = () => {
  const { groups, errored } = useUserGroups();
  const [items, setItems] = useState<IYouTubeVideoID[] | null>(null);
  const [pagination, setPagination] = useState<APIPaginationData | null>(null);
  const [error, setError] = useState<string>('');

  const router = useRouter();

  const fetchItems = async ({ group, guild, page }: IFetcherOptions = {}) => {
    setItems(null);
    setPagination(null);
    setError('');

    try {
      const { videoIDs, pagination } = await apiService.videoIDs.getVideoIDs({
        group,
        guild,
        page,
      });
      setItems(videoIDs);
      setPagination(pagination);
    } catch (err) {
      setError('Failed to load video IDs.');
    }
  };

  const deleteItem = async (id: string) => {
    try {
      await apiService.videoIDs.deleteVideoID(id);
      setItems((items) => items.filter((video) => video.id !== id));
      toaster.success('Video ID deleted successfully!');
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
    router.push('/manage/videos/new');
  };

  const handleDeleteActionClick = async (id: string) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'You are about to delete this video ID. This cannot be undone!',
      showCancelButton: true,
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel',
    });

    if (result.isConfirmed) {
      await deleteItem(id);
    }
  };

  const handleTextClick = async (text: string) => {
    const url = `https://youtube.com/watch/?v=${text}`;

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
      title="Blacklisted YouTube Video IDs"
      buttonText="Add video ID"
      onButtonClick={handleNewButtonClick}
    >
      {groups && (
        <Blacklist
          items={items}
          pagination={pagination}
          fetcher={fetchItems}
          error={error}
          zdsMessage="No blacklisted video IDs have been found."
          groups={groups}
          onTextClick={handleTextClick}
          actions={[{ label: 'Delete', onClick: handleDeleteActionClick }]}
          entryComponent={YouTubeVideoEntry}
        />
      )}

      {groups === null && !error && <Loading />}
      {groups === null && error.length > 0 && (
        <MessageBox level={MessageBoxLevel.DANGER} message={error} />
      )}
    </DashboardLayout>
  );
};

export default ManageVideosIndexPage;
