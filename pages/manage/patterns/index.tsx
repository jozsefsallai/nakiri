import MessageBox, { MessageBoxLevel } from '@/components/common/messagebox/MessageBox';
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

import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import RegexTester from '@/components/common/regex-tester/RegexTester';

const MySwal = withReactContent(Swal);

const ManageLinkPatternsIndexPage = () => {
  const [items, setItems] = useState<ILinkPattern[] | null>(null);
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

  const fetchItems = async (guild?: string | null) => {
    setItems(null);
    setError('');

    try {
      const { patterns } = await apiService.patterns.getLinkPatterns(guild);
      setItems(patterns);
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

  const handleTestActionClick = async (id: string) => {
    const targetPattern = items.find(pattern => pattern.id === id);

    await MySwal.fire({
      title: 'Regex Tester',
      html: (
        <div>
          <div className="text-sm">
            Pattern:<br /><pre>{targetPattern.pattern}</pre>
          </div>

          <RegexTester pattern={targetPattern.pattern} />
        </div>
      )
    });
  };

  useEffect(() => {
    fetchGuilds();
  }, []);

  return (
    <DashboardLayout hasContainer title="Blacklisted Link Patterns" buttonText="Add pattern" onButtonClick={handleNewButtonClick}>
      {guilds && (
        <Blacklist
          items={items}
          fetcher={fetchItems}
          error={error}
          zdsMessage="No blacklisted link patterns have been found."
          guilds={guilds}
          actions={[
            { label: 'Test', onClick: handleTestActionClick },
            { label: 'Delete', onClick: handleDeleteActionClick }
          ]}
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

export default ManageLinkPatternsIndexPage;
