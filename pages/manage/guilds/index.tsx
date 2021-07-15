import MessageBox, { MessageBoxLevel } from '@/components/common/messagebox/MessageBox';
import Loading from '@/components/loading/Loading';
import { IGuildWithKey } from '@/controllers/guilds/IGuild';
import DashboardLayout from '@/layouts/DashboardLayout';

import { redirectIfAnonmyous } from '@/lib/redirects';
import apiService from '@/services/apis';
import { useEffect, useState } from 'react';

const ManageGuildsIndexPage = () => {
  const [ guilds, setGuilds ] = useState<IGuildWithKey[] | null>(null);
  const [ error, setError ] = useState('');

  const fetchGuilds = async () => {
    setGuilds(null);
    setError('');

    try {
      const { guilds } = await apiService.guilds.getGuilds();
      setGuilds(guilds);
    } catch (err) {
      setError('Failed to fetch guilds.')
    }
  };

  useEffect(() => {
    fetchGuilds();
  }, []);

  return (
    <DashboardLayout hasContainer title="Guild API Keys">
      {guilds && (
        <div>
          List of guilds will be displayed here.
        </div>
      )}

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
