import MessageBox, {
  MessageBoxLevel,
} from '@/components/common/messagebox/MessageBox';
import Loading from '@/components/loading/Loading';
import { IDiscordGuild } from '@/db/models/blacklists/DiscordGuild';
import DashboardLayout from '@/layouts/DashboardLayout';
import Blacklist, { IFetcherOptions } from '@/components/blacklist/Blacklist';

import apiService from '@/services/apis';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useUserGroups } from '@/hooks/useGroups';

import Swal from 'sweetalert2';
import toaster from '@/lib/toaster';
import { errors } from '@/lib/errors';
import { APIPaginationData } from '@/services/axios';
import DiscordGuildEntry from '@/components/blacklist/entry-data/DiscordGuildEntry';
import Link from 'next/link';

const InfoBox = () => (
  <>
    <p>
      Here you can manage the Discord guild ID blacklist. This is a list of
      Discord guilds that are forbidden from posting. The analyzer will detect
      if an invite link that points to any of these guilds is posted.
    </p>
    <p>
      <strong>Note:</strong> this is NOT where you manage your authorized
      guilds. You can do that on the{' '}
      <Link href="/manage/guilds">
        <a>My Guilds</a>
      </Link>{' '}
      page.
    </p>
  </>
);

const ManageGuildsIndexPage = () => {
  const { groups, errored } = useUserGroups();
  const [items, setItems] = useState<IDiscordGuild[] | null>(null);
  const [pagination, setPagination] = useState<APIPaginationData | null>(null);
  const [error, setError] = useState<string>('');

  const router = useRouter();

  const fetchItems = async ({ group, guild, page }: IFetcherOptions = {}) => {
    setItems(null);
    setPagination(null);
    setError('');

    try {
      const { discordGuilds, pagination } =
        await apiService.guildIDs.getDiscordGuilds({ group, guild, page });
      setItems(discordGuilds);
      setPagination(pagination);
    } catch (err) {
      setError('Failed to load blacklisted guilds.');
    }
  };

  const deleteItem = async (id: string) => {
    try {
      await apiService.guildIDs.deleteDiscordGuild(id);
      setItems((items) => items.filter((guild) => guild.id !== id));
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
      cancelButtonText: 'Cancel',
    });

    if (result.isConfirmed) {
      await deleteItem(id);
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
      title="Blacklisted Discord Guilds"
      infoBox={<InfoBox />}
      buttonText="Add guild ID"
      onButtonClick={handleNewButtonClick}
    >
      {groups && (
        <Blacklist
          items={items}
          pagination={pagination}
          fetcher={fetchItems}
          error={error}
          zdsMessage="No blacklisted guilds have been found."
          groups={groups}
          actions={[{ label: 'Delete', onClick: handleDeleteActionClick }]}
          entryComponent={DiscordGuildEntry}
        />
      )}

      {groups === null && !error && <Loading />}
      {groups === null && error.length > 0 && (
        <MessageBox level={MessageBoxLevel.DANGER} message={error} />
      )}
    </DashboardLayout>
  );
};

export default ManageGuildsIndexPage;
