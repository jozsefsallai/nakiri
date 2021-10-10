import MessageBox, {
  MessageBoxLevel,
} from '@/components/common/messagebox/MessageBox';
import ZeroDataState from '@/components/common/zds/ZeroDataState';
import GuildList from '@/components/guilds/GuildList';
import Loading from '@/components/loading/Loading';
import { useGuilds } from '@/hooks/useGuilds';
import DashboardLayout from '@/layouts/DashboardLayout';

import { redirectIfAnonmyous } from '@/lib/redirects';
import { useRouter } from 'next/router';

const ManageGuildsIndexPage = () => {
  const [guilds, _, errored] = useGuilds();

  const router = useRouter();

  const handleNewButtonClick = () => {
    router.push('/manage/guilds/new');
  };

  return (
    <DashboardLayout
      hasContainer
      title="Guild API Keys"
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

export const getServerSideProps = async ({ req, res }) => {
  await redirectIfAnonmyous(req, res);
  return {
    props: {},
  };
};

export default ManageGuildsIndexPage;
