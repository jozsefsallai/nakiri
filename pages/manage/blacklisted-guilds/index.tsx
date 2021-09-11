import MessageBox, { MessageBoxLevel } from '@/components/common/messagebox/MessageBox';
import Loading from '@/components/loading/Loading';
import { IDiscordGuild } from '@/db/models/blacklists/DiscordGuild';
import DashboardLayout from '@/layouts/DashboardLayout';
import Blacklist, { IFetcherOptions } from '@/components/blacklist/Blacklist';

import { redirectIfAnonmyous } from '@/lib/redirects';
import apiService from '@/services/apis';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useGuilds } from '@/hooks/useGuilds';

import Swal from 'sweetalert2';
import toaster from '@/lib/toaster';
import { errors } from '@/lib/errors';
import { APIPaginationData } from '@/services/axios';
import DiscordGuildEntry from '@/components/blacklist/entry-data/DiscordGuildEntry';

const ManageGuildsIndexPage = () => {
  const [ guilds, _, guildsErrored ] = useGuilds();
  const [ items, setItems ] = useState<IDiscordGuild[] | null>(null);
  const [ pagination, setPagination ] = useState<APIPaginationData | null>(null);
  const [ error, setError ] = useState<string>('');

  const router = useRouter();

  const fetchItems = async ({ guild, page }: IFetcherOptions = {}) => {
    setItems(null);
    setPagination(null);
    setError('');

    try {
      const { discordGuilds, pagination } = await apiService.guildIDs.getDiscordGuilds({ guild, page });
      setItems(discordGuilds);
      setPagination(pagination);
    } catch (err) {
      setError('Failed to load blacklisted guilds.');
    }
  };

  const deleteItem = async (id: string) => {
    try {
      await apiService.guildIDs.deleteDiscordGuild(id);
      setItems(items => items.filter(guild => guild.id !== id));
      toaster.success('Guild deleted successfully!');
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
    router.push('/manage/blacklisted-guilds/new');
  };

  const handleDeleteActionClick = async (id: string) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'You are about to delete this guild. This cannot be undone!',
      showCancelButton: true,
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel'
    });

    if (result.isConfirmed) {
      await deleteItem(id);
    }
  };

  useEffect(() => {
    if (guildsErrored) {
      setError('Failed to fetch your guilds.');
    }
  }, [guildsErrored]);

  return (
    <DashboardLayout hasContainer title="Blacklisted Discord Guilds" buttonText="Add guild ID" onButtonClick={handleNewButtonClick}>
      {guilds && (
        <Blacklist
          items={items}
          pagination={pagination}
          fetcher={fetchItems}
          error={error}
          zdsMessage="No blacklisted guilds have been found."
          guilds={guilds}
          actions={[
            { label: 'Delete', onClick: handleDeleteActionClick }
          ]}
          entryComponent={DiscordGuildEntry}
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

export default ManageGuildsIndexPage;
