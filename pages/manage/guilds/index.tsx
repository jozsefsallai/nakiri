import MessageBox, { MessageBoxLevel } from '@/components/common/messagebox/MessageBox';
import ZeroDataState from '@/components/common/zds/ZeroDataState';
import GuildList from '@/components/guilds/GuildList';
import Loading from '@/components/loading/Loading';
import { IGuildWithKey } from '@/controllers/guilds/IGuild';
import DashboardLayout from '@/layouts/DashboardLayout';

import { redirectIfAnonmyous } from '@/lib/redirects';
import apiService from '@/services/apis';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const ManageGuildsIndexPage = () => {
  const [ guilds, setGuilds ] = useState<IGuildWithKey[] | null>(null);
  const [ error, setError ] = useState('');

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

  const handleNewButtonClick = () => {
    router.push('/manage/guilds/new');
  };

  useEffect(() => {
    fetchGuilds();
  }, []);

  return (
    <DashboardLayout hasContainer title="Guild API Keys" buttonText="Add Guild" onButtonClick={handleNewButtonClick}>
      {guilds && guilds.length > 0 && <GuildList guilds={guilds} />}
      {guilds && guilds.length === 0 && <ZeroDataState message="There are no guilds yet." />}

      {!guilds && !error && <Loading />}
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

export default ManageGuildsIndexPage;
