import MessageBox, {
  MessageBoxLevel,
} from '@/components/common/messagebox/MessageBox';
import ZeroDataState from '@/components/common/zds/ZeroDataState';
import GuildList from '@/components/guilds/GuildList';
import Loading from '@/components/loading/Loading';
import { useGuilds } from '@/hooks/useGuilds';
import DashboardLayout from '@/layouts/DashboardLayout';
import Link from 'next/link';

import { useRouter } from 'next/router';

const InfoBox = () => (
  <>
    <p>
      This section allows you to view the Discord guilds you have access to and
      have been added to the Nakiri service. You can also authorize new guilds
      here if you have access to them.
    </p>
    <p>
      <strong>Note:</strong> this is NOT where you manage blacklisted guilds.
      You can do that on the{' '}
      <Link href="/manage/blacklisted-guilds">
        <a>Blacklisted Guilds</a>
      </Link>{' '}
      page.
    </p>
  </>
);

const ManageGuildsIndexPage = () => {
  const [guilds, _, errored] = useGuilds();

  const router = useRouter();

  const handleNewButtonClick = () => {
    router.push('/manage/guilds/new');
  };

  return (
    <DashboardLayout
      hasContainer
      title="Authorized Guilds"
      infoBox={<InfoBox />}
      buttonText="Add Guild"
      onButtonClick={handleNewButtonClick}
    >
      {guilds && guilds.length > 0 && <GuildList guilds={guilds} />}
      {guilds && guilds.length === 0 && (
        <ZeroDataState message="There are no guilds yet." />
      )}

      {!guilds && !errored && <Loading />}
      {errored && (
        <MessageBox
          level={MessageBoxLevel.DANGER}
          message="Failed to fetch your guilds."
        />
      )}
    </DashboardLayout>
  );
};

export default ManageGuildsIndexPage;
