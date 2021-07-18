import MessageBox, { MessageBoxLevel } from '@/components/common/messagebox/MessageBox';
import ZeroDataState from '@/components/common/zds/ZeroDataState';
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

const ManageVideosIndexPage = () => {
  const [ items, setItems ] = useState<IYouTubeVideoID[] | null>(null);
  const [ guilds, setGuilds ] = useState<IGuild[] | null>(null);
  const [ error, setError ] = useState<string>('');

  const router = useRouter();

  const fetchItems = async () => {
    setItems(null);
    setError('');

    try {
      const { videoIDs } = await apiService.videoIDs.getVideoIDs();
      setItems(videoIDs);

      if (videoIDs?.length) {
        const { guilds } = await apiService.guilds.getGuilds();
        setGuilds(guilds);
      }
    } catch (err) {
      setError('Failed to load video IDs.');
    }
  };

  const handleNewButtonClick = () => {
    router.push('/manage/videos/new');
  };

  const handleDeleteActionClick = (id: string) => {
    alert(`Not implemented ${id}`);
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
    fetchItems();
  }, []);

  return (
    <DashboardLayout hasContainer title="Blacklisted YouTube Video IDs" buttonText="Add video ID" onButtonClick={handleNewButtonClick}>
      {items && items.length > 0 && guilds && (
        <Blacklist
          items={items}
          guilds={guilds}
          onTextClick={handleTextClick}
          actions={[
            { label: 'Delete', onClick: handleDeleteActionClick }
          ]}
        />
      )}
      {items && items.length === 0 && <ZeroDataState message="No blacklisted video IDs have been found." />}

      {(!items || (items && !guilds)) && !error && <Loading />}
      {error.length > 0 && <MessageBox level={MessageBoxLevel.DANGER} message={error} />}
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
