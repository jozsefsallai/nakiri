import MessageBox, { MessageBoxLevel } from '@/components/common/messagebox/MessageBox';
import Button, { ButtonSize } from '@/components/common/button/Button';
import Loading from '@/components/loading/Loading';
import { IKeywordWhitelistedChannel } from '@/db/models/keywords/KeywordWhitelistedChannel';
import DashboardLayout from '@/layouts/DashboardLayout';
import Blacklist from '@/components/blacklist/Blacklist';

import { redirectIfDoesNotHavePermission } from '@/lib/redirects';
import { UserPermissions } from '@/lib/UserPermissions';

import apiService from '@/services/apis';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useState } from 'react';

import { IGuild } from '@/controllers/guilds/IGuild';

import Swal from 'sweetalert2';
import toaster from '@/lib/toaster';
import { errors } from '@/lib/errors';

const ManageWhitelistedChannelsIndexPage = () => {
  const [items, setItems] = useState<IKeywordWhitelistedChannel[] | null>(null);
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
      const { channels } = await apiService.keywordWhitelistedChannels.getWhitelistedChannels(guild);
      setItems(channels);
    } catch (err) {
      setError('Failed to load whitelisted channels.');
    }
  };

  const handleNewButtonClick = () => {
    router.push('/manage/monitored-keywords/whitelisted-channels/new');
  };

  const handleKeywordsClick = () => {
    router.push('/manage/monitored-keywords');
  };

  const unwhitelistChannel = async (entry: IKeywordWhitelistedChannel) => {
    try {
      await apiService.keywordWhitelistedChannels.deleteWhitelistedChannel(entry.guildId, entry.id);
      setItems(items.filter(i => i.id !== entry.id));
      toaster.success('Channel ID unwhitelisted successfully!');
    } catch (err) {
      const message = err?.response?.data?.error;

      if (message) {
        toaster.danger(errors[message]);
        return;
      }

      toaster.danger(errors.INTERNAL_SERVER_ERROR);
    }
  };

  const handleDeleteActionClick = async (id: string) => {
    const entry = items.find(i => i.id === id);
    if (!entry) {
      return;
    }

    const result = await Swal.fire({
      title: 'Confirm action',
      text: `Are you sure you want to unwhitelist channel with ID "${entry.channelId}"?`,
      showCancelButton: true,
      confirmButtonText: 'Unwhitelist',
      cancelButtonText: 'Cancel',
    });

    if (result.isConfirmed) {
      await unwhitelistChannel(entry);
    }
  };

  useEffect(() => {
    fetchGuilds();
  }, []);

  return (
    <DashboardLayout hasContainer title="Monitored Keywords - Whitelisted Channels" buttonText="Add channel" onButtonClick={handleNewButtonClick}>
      <Button size={ButtonSize.SMALL} onClick={handleKeywordsClick}>Manage Monitored Keywords</Button>

      {guilds && (
        <Blacklist
          items={items}
          fetcher={fetchItems}
          error={error}
          zdsMessage="No whitelisted channels have been found."
          guilds={guilds}
          hideGlobal
          actions={[
            { label: 'Unwhitelist', onClick: handleDeleteActionClick }
          ]}
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

export default ManageWhitelistedChannelsIndexPage;
