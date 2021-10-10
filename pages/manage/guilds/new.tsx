import MessageBox, {
  MessageBoxLevel,
} from '@/components/common/messagebox/MessageBox';
import ZeroDataState from '@/components/common/zds/ZeroDataState';
import GuildList from '@/components/guilds/GuildList';
import Loading from '@/components/loading/Loading';
import { IGuild, IGuildWithKey } from '@/controllers/guilds/IGuild';
import { useGuilds } from '@/hooks/useGuilds';
import DashboardLayout from '@/layouts/DashboardLayout';
import { errors } from '@/lib/errors';

import { redirectIfAnonmyous } from '@/lib/redirects';
import toaster from '@/lib/toaster';
import apiService from '@/services/apis';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import Swal from 'sweetalert2';

const ManageGuildsIndexPage = () => {
  const [currentGuilds, setCurrentGuilds] = useGuilds();

  const [guilds, setGuilds] = useState<IGuild[] | null>(null);
  const [error, setError] = useState('');

  const [requestInProgress, setRequestInProgress] = useState(false);

  const router = useRouter();

  const fetchGuilds = async () => {
    setGuilds(null);
    setError('');

    try {
      const { guilds } = await apiService.guilds.getAllGuilds();
      setGuilds(guilds);
    } catch (err) {
      setError('Failed to fetch your guilds.');
    }
  };

  const addGuild = async (guild: IGuild) => {
    try {
      setRequestInProgress(true);

      const { key } = await apiService.guilds.addNewGuild(guild.id);
      toaster.success(`Added "${guild.name}" with key "${key}".`);

      const finalGuild: IGuildWithKey = { ...guild, key };

      if (!currentGuilds) {
        setCurrentGuilds([finalGuild]);
      } else {
        const newGuilds = currentGuilds.slice(0);
        newGuilds.push(finalGuild);
        setCurrentGuilds(newGuilds.sort((a, b) => b.id.localeCompare(a.id)));
      }

      setTimeout(() => {
        router.push('/manage/guilds');
      }, 1000);
    } catch (err) {
      setRequestInProgress(false);

      const message = err?.response?.data?.error;
      if (message) {
        toaster.danger(errors[message]);
        return;
      }

      toaster.danger(errors.INTERNAL_SERVER_ERROR);
    }
  };

  const handleGuildClick = async (guild: IGuild) => {
    if (requestInProgress) {
      return;
    }

    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `Are you sure you want to add the guild "${guild.name}" and generate an API key for it?`,
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
    });

    if (result.isConfirmed) {
      await addGuild(guild);
    }
  };

  useEffect(() => {
    fetchGuilds();
  }, []);

  return (
    <DashboardLayout hasContainer title="Add Guild">
      {guilds && guilds.length > 0 && (
        <GuildList guilds={guilds} onGuildClick={handleGuildClick} />
      )}
      {guilds && guilds.length === 0 && (
        <ZeroDataState message="You do not have access to any guilds." />
      )}

      {!guilds && !error && <Loading />}
      {error.length > 0 && (
        <MessageBox level={MessageBoxLevel.DANGER} message={error} />
      )}
    </DashboardLayout>
  );
};

export const getServerSideProps = async ({ req, res }) => {
  await redirectIfAnonmyous(req, res);
  return {
    props: {},
  };
};

export default ManageGuildsIndexPage;
