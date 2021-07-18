import MessageBox, { MessageBoxLevel } from '@/components/common/messagebox/MessageBox';
import ZeroDataState from '@/components/common/zds/ZeroDataState';
import Loading from '@/components/loading/Loading';
import { ILinkPattern } from '@/db/models/blacklists/LinkPattern';
import DashboardLayout from '@/layouts/DashboardLayout';
import Blacklist from '@/components/blacklist/Blacklist';

import { redirectIfAnonmyous } from '@/lib/redirects';
import apiService from '@/services/apis';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useState } from 'react';

import { IGuild } from '@/controllers/guilds/IGuild';

const ManageLinkPatternsIndexPage = () => {
  const [items, setItems] = useState<ILinkPattern[] | null>(null);
  const [guilds, setGuilds] = useState<IGuild[] | null>(null);
  const [error, setError] = useState<string>('');

  const router = useRouter();

  const fetchItems = async () => {
    setItems(null);
    setError('');

    try {
      const { patterns } = await apiService.patterns.getLinkPatterns();
      setItems(patterns);

      if (patterns?.length) {
        const { guilds } = await apiService.guilds.getGuilds();
        setGuilds(guilds);
      }
    } catch (err) {
      setError('Failed to load link patterns.');
    }
  };

  const handleNewButtonClick = () => {
    router.push('/manage/patterns/new');
  };

  const handleDeleteActionClick = (id: string) => {
    alert(`Not implemented ${id}`);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  return (
    <DashboardLayout hasContainer title="Blacklisted Link Patterns" buttonText="Add pattern" onButtonClick={handleNewButtonClick}>
      {items && items.length > 0 && guilds && (
        <Blacklist
          items={items}
          guilds={guilds}
          actions={[
            { label: 'Delete', onClick: handleDeleteActionClick }
          ]}
        />
      )}
      {items && items.length === 0 && <ZeroDataState message="No blacklisted link patterns have been found." />}

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

export default ManageLinkPatternsIndexPage;
