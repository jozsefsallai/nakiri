import MessageBox, { MessageBoxLevel } from '@/components/common/messagebox/MessageBox';
import Loading from '@/components/loading/Loading';
import { IYouTubeVideoID } from '@/db/models/blacklists/YouTubeVideoID';
import DashboardLayout from '@/layouts/DashboardLayout';
import Blacklist from '@/components/blacklist/Blacklist';

import { redirectIfAnonmyous } from '@/lib/redirects';
import apiService from '@/services/apis';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useState } from 'react';

import Swal from 'sweetalert2';
import { IGuild } from '@/controllers/guilds/IGuild';
import toaster from '@/lib/toaster';
import { errors } from '@/lib/errors';

const ManageVideosIndexPage = () => {
  const [ items, setItems ] = useState<IYouTubeVideoID[] | null>(null);
  const [ guilds, setGuilds ] = useState<IGuild[] | null>(null);
  const [ error, setError ] = useState<string>('');

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

  const fetchItems = async (guild?: string | null) => {
    setItems(null);
    setError('');

    try {
      const { videoIDs } = await apiService.videoIDs.getVideoIDs(guild);
      setItems(videoIDs);
    } catch (err) {
      setError('Failed to load video IDs.');
    }
  };

  const deleteItem = async (id: string) => {
    try {
      await apiService.videoIDs.deleteVideoID(id);
      setItems(items => items.filter(video => video.id !== id));
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
      cancelButtonText: 'Cancel'
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
      cancelButtonText: 'No'
    });

    if (result.isConfirmed) {
      window.open(url, '_blank');
    }
  };

  useEffect(() => {
    fetchGuilds();
  }, []);

  return (
    <DashboardLayout hasContainer title="Blacklisted YouTube Video IDs" buttonText="Add video ID" onButtonClick={handleNewButtonClick}>
      {guilds && (
        <Blacklist
          items={items}
          fetcher={fetchItems}
          error={error}
          zdsMessage="No blacklisted video IDs have been found."
          guilds={guilds}
          onTextClick={handleTextClick}
          actions={[
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
  await redirectIfAnonmyous(req, res);
  return {
    props: {}
  };
};

export default ManageVideosIndexPage;
