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

  const handleNewButtonClick = () => {
    router.push('/manage/monitored-keywords/new');
  };

  const handleWhitelistsClick = () => {
    router.push('/manage/monitored-keywords/whitelisted-channels');
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
          hideGlobal
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
