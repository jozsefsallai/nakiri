import MessageBox, {
  MessageBoxLevel,
} from '@/components/common/messagebox/MessageBox';
import Loading from '@/components/loading/Loading';
import { ILinkPattern } from '@/db/models/blacklists/LinkPattern';
import DashboardLayout from '@/layouts/DashboardLayout';
import Blacklist, { IFetcherOptions } from '@/components/blacklist/Blacklist';

import apiService from '@/services/apis';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useUserGroups } from '@/hooks/useGroups';

import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import RegexTester from '@/components/common/regex-tester/RegexTester';
import toaster from '@/lib/toaster';
import { errors } from '@/lib/errors';
import { APIPaginationData } from '@/services/axios';

const MySwal = withReactContent(Swal);

const InfoBox = () => (
  <>
    <p>
      Here you can manage the blacklisted link patterns. Using this blacklist
      assumes you have prior experience with and knowledge of
      JavaScript-compatible regular expressions. These patterns will be used to
      detect malicious URLs.
    </p>
    <p>
      The handy testing utility will allow you to test your patterns against an
      arbitrary message.
    </p>
  </>
);

const ManageLinkPatternsIndexPage = () => {
  const { groups, errored } = useUserGroups();
  const [items, setItems] = useState<ILinkPattern[] | null>(null);
  const [pagination, setPagination] = useState<APIPaginationData | null>(null);
  const [error, setError] = useState<string>('');

  const router = useRouter();

  const fetchItems = async ({ group, guild, page }: IFetcherOptions = {}) => {
    setItems(null);
    setPagination(null);
    setError('');

    try {
      const { patterns } = await apiService.patterns.getLinkPatterns({
        group,
        guild,
        page,
      });
      setItems(patterns);
      setPagination(pagination);
    } catch (err) {
      setError('Failed to load link patterns.');
    }
  };

  const deleteItem = async (id: string) => {
    try {
      await apiService.patterns.deleteLinkPattern(id);
      setItems((items) => items.filter((pattern) => pattern.id !== id));
      toaster.success('Link pattern deleted successfully!');
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
    router.push('/manage/patterns/new');
  };

  const handleDeleteActionClick = async (id: string) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'You are about to delete this link pattern. This cannot be undone!',
      showCancelButton: true,
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel',
    });

    if (result.isConfirmed) {
      await deleteItem(id);
    }
  };

  const handleTestActionClick = async (id: string) => {
    const targetPattern = items.find((pattern) => pattern.id === id);

    await MySwal.fire({
      title: 'Regex Tester',
      html: <RegexTester pattern={targetPattern.pattern} />,
    });
  };

  useEffect(() => {
    if (errored) {
      setError('Failed to fetch your groups.');
    }
  }, [errored]);

  return (
    <DashboardLayout
      hasContainer
      title="Blacklisted Link Patterns"
      infoBox={<InfoBox />}
      buttonText="Add pattern"
      onButtonClick={handleNewButtonClick}
    >
      {groups && (
        <Blacklist
          items={items}
          pagination={pagination}
          fetcher={fetchItems}
          error={error}
          zdsMessage="No blacklisted link patterns have been found."
          groups={groups}
          actions={[
            { label: 'Test', onClick: handleTestActionClick },
            { label: 'Delete', onClick: handleDeleteActionClick },
          ]}
        />
      )}

      {groups === null && !error && <Loading />}
      {groups === null && error.length > 0 && (
        <MessageBox level={MessageBoxLevel.DANGER} message={error} />
      )}
    </DashboardLayout>
  );
};

export default ManageLinkPatternsIndexPage;
